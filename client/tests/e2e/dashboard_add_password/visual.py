"""Add Password page visual tests."""
import pytest
from playwright.sync_api import Page, expect

from tests.config import NORMAL_TIMEOUT


def test_add_password_visual(page: Page, app_url: str, authenticated_page):
    """Page loads at desktop viewport."""
    page.set_viewport_size({"width": 1440, "height": 900})
    # Navigate via SPA click to preserve master password Redux state
    page.get_by_role("button", name="Add Password", exact=False).first.click(timeout=NORMAL_TIMEOUT)
    page.wait_for_load_state("networkidle")
    expect(page.get_by_text("Add Password")).to_be_visible(timeout=NORMAL_TIMEOUT)
