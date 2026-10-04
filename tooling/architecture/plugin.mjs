import path from 'node:path';

const layers = new Set(['domain', 'application', 'adapters', 'ui']);

function describe(file, root) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (relative.startsWith('../') || path.isAbsolute(relative)) return null;
  const parts = relative.split('/');
  return {
    area: parts[0],
    feature: parts[0] === 'features' ? parts[1] : undefined,
    layer:
      parts[0] === 'features' && layers.has(parts[2]) ? parts[2] : undefined,
    public: parts.length === 3 && /^public(?:\.[cm]?[jt]s)?$/.test(parts[2]),
    relative,
  };
}

export default {
  meta: { name: 'folio-architecture' },
  rules: {
    boundaries: {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce feature public APIs and inward dependencies.',
        },
        schema: [],
        messages: { boundary: '{{reason}} Import: {{specifier}}' },
      },
      create(context) {
        const root = path.resolve(context.cwd ?? context.getCwd(), 'src');
        const filename =
          context.physicalFilename ?? context.filename ?? context.getFilename();
        const from = describe(filename, root);
        if (!from) return {};
        function check(source) {
          if (!source) return;
          const specifier =
            typeof source.value === 'string'
              ? source.value
              : source.type === 'TemplateLiteral' &&
                  source.expressions.length === 0
                ? source.quasis[0].value.cooked
                : null;
          if (typeof specifier !== 'string') return;
          const clean = specifier.split(/[?#]/, 1)[0];
          const target = clean.startsWith('@/')
            ? path.resolve(root, clean.slice(2))
            : clean.startsWith('.')
              ? path.resolve(path.dirname(filename), clean)
              : null;
          const to = target ? describe(target, root) : null;
          let reason;
          if (
            from.layer === 'domain' &&
            /^(vue(?:\/|$)|@vue\/|@vueuse\/)/.test(clean)
          ) {
            reason = 'Domain code must not depend on Vue or Vue composables.';
          } else if (to) {
            if (
              ['shared', 'design-system'].includes(from.area) &&
              ['features', 'app'].includes(to.area)
            ) {
              reason =
                'Shared code and the design system must not depend on features or the app.';
            } else if (
              from.layer === 'domain' &&
              (to.public ||
                to.area === 'design-system' ||
                clean.endsWith('.vue'))
            ) {
              reason =
                'Domain code must not depend on public barrels or UI components.';
            } else if (
              from.layer === 'application' &&
              to.feature === from.feature &&
              to.public
            ) {
              reason =
                'Application code must use direct inward imports instead of its own public barrel.';
            } else if (from.area === 'features' && to.area === 'app') {
              reason = 'Features must not depend on the app composition root.';
            } else if (
              to.feature &&
              to.feature !== from.feature &&
              !to.public
            ) {
              reason = 'Access another feature through its public.ts API.';
            } else if (
              from.layer === 'domain' &&
              ['application', 'adapters', 'ui'].includes(to.layer)
            ) {
              reason =
                'Domain code must not depend on application, adapter, or UI layers.';
            } else if (
              from.layer === 'application' &&
              ['adapters', 'ui'].includes(to.layer)
            ) {
              reason = 'Application code must not depend on adapters or UI.';
            }
          }
          if (reason)
            context.report({
              node: source,
              messageId: 'boundary',
              data: { reason, specifier },
            });
        }
        return {
          ImportDeclaration(node) {
            check(node.source);
          },
          ExportNamedDeclaration(node) {
            check(node.source);
          },
          ExportAllDeclaration(node) {
            check(node.source);
          },
          ImportExpression(node) {
            check(node.source);
          },
          TSImportType(node) {
            const argument = node.argument ?? node.parameter ?? node.source;
            check(
              argument?.type === 'TSLiteralType' ? argument.literal : argument,
            );
          },
          CallExpression(node) {
            if (
              node.callee.type === 'Identifier' &&
              node.callee.name === 'require'
            )
              check(node.arguments[0]);
          },
          TSImportEqualsDeclaration(node) {
            if (node.moduleReference.type === 'TSExternalModuleReference')
              check(node.moduleReference.expression);
          },
        };
      },
    },
  },
};
