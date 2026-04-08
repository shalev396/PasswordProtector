"""Add Password page accessibility tests."""
import pytest
from axe_playwright_python.sync_playwright import Axe
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_add_password_accessibility(page: Page, app_url: str, authenticated_page):
    """axe-core scan for a11y violations."""
    # Navigate via SPA click to preserve master password Redux state
    page.get_by_role("button", name="Add Password", exact=False).first.click(timeout=NORMAL_TIMEOUT)
    page.wait_for_load_state("networkidle")
    expect(page.get_by_text("Add Password")).to_be_visible(timeout=NORMAL_TIMEOUT)
    axe = Axe()
    results = axe.run(page)
    violations = results.response.get("violations", [])
    assert violations == [], f"Accessibility violations: {violations}"
