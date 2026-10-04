import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
const { Given, When, Then } = createBdd();
Given('I open a fresh workspace', async ({ page }) => {
  await page.goto('/');
});
When('I choose the rectangle tool', async ({ page }) => {
  await page
    .getByRole('button', { name: 'Rectangle (R)', exact: true })
    .click();
});
Then('the rectangle tool is selected', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: 'Rectangle (R)', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});
Then('the workspace explains that drawing comes next', async ({ page }) => {
  await expect(
    page.getByText('UI foundation — drawing comes next'),
  ).toBeVisible();
});
When('I switch to the dark theme', async ({ page }) => {
  await page
    .getByRole('button', { name: 'Workspace menu', exact: true })
    .click();
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
});
When('I reload the workspace', async ({ page }) => {
  await page.reload();
});
Then('the dark theme is still active', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page
    .getByRole('button', { name: 'Workspace menu', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Switch to light theme' }),
  ).toBeVisible();
});
When('I open keyboard help', async ({ page }) => {
  if (
    !(await page
      .getByRole('button', { name: 'Help and shortcuts', exact: true })
      .isVisible())
  ) {
    await page
      .getByRole('button', { name: 'Workspace menu', exact: true })
      .click();
  }
  await page
    .getByRole('button', { name: 'Help and shortcuts', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
When('I dismiss the dialog with Escape', async ({ page }) => {
  await page.keyboard.press('Escape');
});
Then('focus returns to the help button', async ({ page }) => {
  const help = page.getByRole('button', {
    name: 'Help and shortcuts',
    exact: true,
  });
  if (await help.isVisible()) await expect(help).toBeFocused();
  else
    await expect(
      page.getByRole('button', { name: 'Workspace menu', exact: true }),
    ).toBeFocused();
});
When('I open the design system', async ({ page }) => {
  await page
    .getByRole('button', { name: 'Workspace menu', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Design system', exact: true })
    .click();
});
Then('I can inspect the live color palette', async ({ page }) => {
  await expect(
    page.getByRole('heading', { name: 'A palette with a purpose' }),
  ).toBeVisible();
});
When('I name the canvas {string}', async ({ page }, name: string) => {
  await page
    .getByRole('button', { name: 'Workspace menu', exact: true })
    .click();
  const nameField = page.getByRole('textbox', { name: 'Canvas name' });
  await nameField.fill('');
  await nameField.pressSequentially(name);
  await expect(page.getByRole('textbox', { name: 'Canvas name' })).toHaveValue(
    name,
  );
});
When(
  'I leave the name field and press the ellipse shortcut',
  async ({ page }) => {
    await page.getByRole('textbox', { name: 'Canvas name' }).press('Escape');
    await page.keyboard.press('o');
  },
);
Then('the ellipse tool is selected', async ({ page }) => {
  const ellipse = page.getByRole('button', {
    name: 'Ellipse (O)',
    exact: true,
  });
  if (await ellipse.isVisible())
    await expect(ellipse).toHaveAttribute('aria-pressed', 'true');
  else {
    await page.getByRole('button', { name: 'More tools', exact: true }).click();
    await expect(
      page.getByRole('button', { name: 'Ellipse O', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
  }
});
When('I choose the teal accent and return to the canvas', async ({ page }) => {
  await page.getByRole('button', { name: 'teal accent', exact: true }).click();
  await page.getByRole('button', { name: 'Back to canvas' }).click();
});
Then('the teal accent is still active', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('data-accent', 'teal');
  await expect(
    page.getByRole('button', { name: 'Rectangle (R)', exact: true }),
  ).toBeVisible();
});
When('I open shape styles if needed', async ({ page }) => {
  await page
    .getByRole('button', { name: 'Rectangle (R)', exact: true })
    .click();
  const toggle = page.getByRole('button', {
    name: 'Shape styles',
    exact: true,
  });
  if (await toggle.isVisible()) await toggle.click();
});
When('I choose a coral stroke', async ({ page }) => {
  await page.getByRole('button', { name: 'Coral stroke', exact: true }).click();
});
Then('the coral stroke is selected', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: 'Coral stroke', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});
When('I open help from the workspace menu', async ({ page }) => {
  await page
    .getByRole('button', { name: 'Workspace menu', exact: true })
    .click();
  await page
    .getByRole('region', { name: 'Workspace menu', exact: true })
    .getByRole('button', { name: 'Help and shortcuts' })
    .click();
  await expect(
    page.getByRole('dialog', { name: 'Make yourself at home' }),
  ).toBeVisible();
});
Then('focus returns to the workspace menu button', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: 'Workspace menu', exact: true }),
  ).toBeFocused();
});
When(
  'I resize the workspace to {int} pixels wide',
  async ({ page }, width: number) => {
    await page.setViewportSize({ width, height: 568 });
  },
);
Then(
  'the canvas name and library controls do not overlap',
  async ({ page }) => {
    const title = await page
      .getByRole('button', { name: 'Workspace menu', exact: true })
      .boundingBox();
    const library = await page
      .getByRole('button', { name: 'Library', exact: true })
      .boundingBox();
    expect(title).not.toBeNull();
    expect(library).not.toBeNull();
    expect(title!.x + title!.width).toBeLessThanOrEqual(library!.x);
  },
);
When('I focus the opacity slider and press Escape', async ({ page }) => {
  await page.getByRole('slider', { name: 'Opacity', exact: true }).focus();
  await page.keyboard.press('Escape');
});
Then(
  'shape styles are closed and their trigger has focus',
  async ({ page }) => {
    await expect(
      page.getByRole('slider', { name: 'Opacity', exact: true }),
    ).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Shape styles', exact: true }),
    ).toBeFocused();
  },
);
When('I open additional tools and choose the image tool', async ({ page }) => {
  await page.getByRole('button', { name: 'More tools', exact: true }).click();
  await page.getByRole('button', { name: 'Image I', exact: true }).click();
});
Then('the image tool is selected in additional tools', async ({ page }) => {
  await page.getByRole('button', { name: 'More tools', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Image I', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});
When('I dismiss additional tools with Escape', async ({ page }) => {
  await page.keyboard.press('Escape');
});
Then('focus returns to the additional tools button', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: 'More tools', exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole('button', { name: 'Image I', exact: true }),
  ).not.toBeVisible();
});
