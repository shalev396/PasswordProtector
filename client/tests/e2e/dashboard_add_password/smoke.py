"""Add Password page smoke tests."""
import pytest
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_add_password_redirects_unauthenticated(page: Page, app_url: str):
    """Unauthenticated user is redirected to login."""
    page.goto(f"{app_url}/dashboard/add", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(f"{app_url}/auth/login", timeout=NORMAL_TIMEOUT)


def test_add_password_loads_authenticated(page: Page, app_url: str, authenticated_page):
    """Navigate from dashboard to Add Password page."""
    # authenticated_page is on /dashboard with master password already set
    # Use SPA navigation (click) so Redux state is preserved
    page.get_by_role("button", name="Add Password", exact=False).first.click(timeout=NORMAL_TIMEOUT)
    page.wait_for_load_state("networkidle")
    expect(page.get_by_text("Add Password")).to_be_visible(timeout=NORMAL_TIMEOUT)


def test_add_password_form_elements(page: Page, app_url: str, authenticated_page):
    """Form has expected fields: Title, Category, and Save button."""
    page.get_by_role("button", name="Add Password", exact=False).first.click(timeout=NORMAL_TIMEOUT)
    page.wait_for_load_state("networkidle")
    expect(page.get_by_label("Title")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_text("Category")).to_be_visible(timeout=NORMAL_TIMEOUT)
    expect(page.get_by_role("button", name="Save Password")).to_be_visible(timeout=NORMAL_TIMEOUT)
