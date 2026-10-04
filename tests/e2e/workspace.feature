Feature: Explore the drawing workspace foundation
  Scenario: Choose a tool and inspect its defaults
    Given I open a fresh workspace
    When I choose the rectangle tool
    Then the rectangle tool is selected
    And the workspace explains that drawing comes next

  Scenario: Keep my preferred appearance
    Given I open a fresh workspace
    When I switch to the dark theme
    And I reload the workspace
    Then the dark theme is still active

  Scenario: Open help and return to the workspace
    Given I open a fresh workspace
    When I open keyboard help
    And I dismiss the dialog with Escape
    Then focus returns to the help button

  Scenario: Explore the live design system
    Given I open a fresh workspace
    When I open the design system
    Then I can inspect the live color palette

  Scenario: Type a name without changing tools
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I name the canvas "Planning room"
    Then the rectangle tool is selected
    When I leave the name field and press the ellipse shortcut
    Then the ellipse tool is selected

  Scenario: Apply an accent to the real workspace
    Given I open a fresh workspace
    When I open the design system
    And I choose the teal accent and return to the canvas
    And I reload the workspace
    Then the teal accent is still active

  Scenario: Change shape defaults on any screen size
    Given I open a fresh workspace
    When I open shape styles if needed
    And I choose a coral stroke
    Then the coral stroke is selected

  Scenario: Return focus after navigating from workspace menu to help
    Given I open a fresh workspace
    When I open help from the workspace menu
    And I dismiss the dialog with Escape
    Then focus returns to the workspace menu button

  Scenario Outline: Use all controls on a narrow screen
    Given I open a fresh workspace
    When I resize the workspace to <width> pixels wide
    Then the canvas name and library controls do not overlap
    When I open shape styles if needed
    And I focus the opacity slider and press Escape
    Then shape styles are closed and their trigger has focus
    Examples:
      | width |
      | 320   |
      | 390   |

  Scenario: Reach additional tools and return focus
    Given I open a fresh workspace
    When I open additional tools and choose the image tool
    Then the image tool is selected in additional tools
    When I dismiss additional tools with Escape
    Then focus returns to the additional tools button
