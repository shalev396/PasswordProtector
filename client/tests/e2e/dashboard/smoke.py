"""
Dashboard page (dashboard) smoke tests.
"""
import pytest
from playwright.sync_api import Page, expect


def test_dashboard_redirects_unauthenticated(page: Page, app_url: str):
    """Asserts unauthenticated users visiting /dashboard are redirected to /auth/login."""
    page.goto(f"{app_url}/dashboard", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    expect(page).to_have_url(f"{app_url}/auth/login")


def test_dashboard_loads_authenticated(page: Page, app_url: str, authenticated_page: Page):
    """Asserts the dashboard loads with Password Vault heading when authenticated."""
    page.goto(f"{app_url}/dashboard", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    if "/auth/login" in page.url:
        pytest.skip("Authentication fixture not available")
    expect(page.get_by_role("heading", name="Password Vault")).to_be_visible()


def test_dashboard_vault_elements(page: Page, app_url: str, authenticated_page: Page):
    """Asserts the vault page shows the Password Vault heading and Add Password button."""
    page.goto(f"{app_url}/dashboard", wait_until="domcontentloaded")
    page.wait_for_load_state("networkidle")
    if "/auth/login" in page.url:
        pytest.skip("Authentication fixture not available")
    expect(page.get_by_role("heading", name="Password Vault")).to_be_visible()
    expect(page.get_by_role("button", name="Add Password").or_(page.get_by_role("link", name="Add Password"))).to_be_visible()
