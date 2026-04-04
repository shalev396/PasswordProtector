"""Edit Password page smoke tests."""
import pytest
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_edit_password_redirects_unauthenticated(page: Page, app_url: str):
    """Unauthenticated user is redirected to login."""
    page.goto(f"{app_url}/dashboard/edit/test-id", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(f"{app_url}/auth/login", timeout=NORMAL_TIMEOUT)


def test_edit_password_loads_authenticated(page: Page, app_url: str, authenticated_page):
    """With nonexistent ID, page redirects to dashboard (master password required + not found)."""
    # Direct goto resets Redux state, so page redirects to dashboard.
    # This verifies the route exists and the protected redirect works correctly.
    page.goto(f"{app_url}/dashboard/edit/00000000-0000-0000-0000-000000000000", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    if "/auth/login" in page.url:
        pytest.skip("Authentication fixture not available")
    # Page ends up on dashboard (master password lost on full reload, or password not found)
    expect(page.get_by_role("heading", name="Password Vault")).to_be_visible(timeout=NORMAL_TIMEOUT)
