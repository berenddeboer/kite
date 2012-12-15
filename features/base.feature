Feature: base

  browser#getText
  Scenario: get page text
    Given a web page
    When I visit the page
    Then I see the page contents
