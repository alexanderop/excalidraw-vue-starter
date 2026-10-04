Feature: Draw session-only rectangles
  Scenario: Draw a rectangle with mouse or touch and return to selection
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I drag a rectangle on the canvas
    Then I see 1 finished rectangle
    And the selection tool is active
    When I drag a rectangle on the canvas
    Then I see 1 finished rectangle

  Scenario: Keep drawing rectangles in either direction
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I keep the drawing tool selected
    And I drag a rectangle on the canvas
    And I drag a rectangle upward and left
    Then I see 2 finished rectangles
    And the rectangle tool is selected

  Scenario: Cancel a live preview
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I start a rectangle preview
    Then I see a rectangle preview
    When I cancel drawing with Escape
    Then I see 0 finished rectangles
    And there is no rectangle preview

  Scenario: Change tools during a gesture
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I start a rectangle preview
    And I switch to selection during the gesture
    Then I see 0 finished rectangles
    And there is no rectangle preview

  Scenario: Opening help cancels drawing
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I start a rectangle preview
    And I open help during the gesture
    Then I see 0 finished rectangles
    And there is no rectangle preview

  Scenario: Change modifiers without moving the pointer
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I choose clean edges
    And I start a wide rectangle preview
    And I hold Shift and Alt without moving
    Then the preview is a centered square
    When I release modifiers without moving
    Then the preview returns to its original bounds
    When I finish the rectangle
    Then I see 1 finished rectangle

  Scenario: Zoom changes presentation and new drawing coordinates together
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I drag a rectangle on the canvas
    And I zoom to 200 percent
    Then the first rectangle is twice as wide
    When I choose the rectangle tool
    And I drag a rectangle on the canvas
    And I reset the zoom
    Then the second rectangle is half as wide as the first

  Scenario: Drawing styles are captured when the gesture starts
    Given I open a fresh workspace
    When I choose the rectangle tool
    And I drag a rectangle on the canvas
    And I open shape styles if needed
    And I choose a coral stroke
    And I close shape styles if open
    And I drag a rectangle on the canvas
    Then the first rectangle keeps its original ink
    And the second rectangle uses coral ink
