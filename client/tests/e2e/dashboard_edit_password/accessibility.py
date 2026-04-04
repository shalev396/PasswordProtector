"""Edit Password page accessibility tests."""
import pytest
from axe_playwright_python.sync_playwright import Axe
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_edit_password_accessibility(page: Page, app_url: str, authenticated_page):
    """axe-core scan on the edit password route (redirects to dashboard for nonexistent ID)."""
    page.goto(f"{app_url}/dashboard/edit/00000000-0000-0000-0000-000000000000", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    if "/auth/login" in page.url:
        pytest.skip("Authentication fixture not available")
    # Page redirects to dashboard — run a11y scan there
    expect(page.get_by_role("heading", name="Password Vault")).to_be_visible(timeout=NORMAL_TIMEOUT)
    axe = Axe()
    results = axe.run(page)
    violations = results.response.get("violations", [])
    assert violations == [], f"Accessibility violations: {violations}"
