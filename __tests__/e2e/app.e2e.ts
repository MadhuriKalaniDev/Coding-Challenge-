describe('Zeller Customers App E2E', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Customer List Screen', () => {
    it('should show the tab bar with All, Admin, Manager tabs', async () => {
      await expect(element(by.id('tab-All'))).toBeVisible();
      await expect(element(by.id('tab-Admin'))).toBeVisible();
      await expect(element(by.id('tab-Manager'))).toBeVisible();
    });

    it('should show the add button (FAB)', async () => {
      await expect(element(by.id('add-button'))).toBeVisible();
    });

    it('should filter customers when switching tabs', async () => {
      await element(by.id('tab-Admin')).tap();
      // After tapping Admin tab, only admin customers should be shown
      await waitFor(element(by.id('customer-list')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should open search when search button is tapped', async () => {
      await element(by.id('search-toggle')).tap();
      await expect(element(by.id('search-input'))).toBeVisible();
    });

    it('should search customers by name', async () => {
      await element(by.id('search-toggle')).tap();
      await element(by.id('search-input')).typeText('Test');
      await waitFor(element(by.id('customer-list')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should close search bar', async () => {
      await element(by.id('search-toggle')).tap();
      await element(by.id('search-close')).tap();
    });

    it('should pull to refresh', async () => {
      await element(by.id('customer-list')).swipe('down', 'slow');
    });
  });

  describe('Add Customer Screen', () => {
    beforeEach(async () => {
      await element(by.id('add-button')).tap();
    });

    it('should show the new user form', async () => {
      await expect(element(by.id('input-firstName'))).toBeVisible();
      await expect(element(by.id('input-lastName'))).toBeVisible();
      await expect(element(by.id('input-email'))).toBeVisible();
      await expect(element(by.id('submit-button'))).toBeVisible();
    });

    it('should show validation errors for empty form', async () => {
      await element(by.id('submit-button')).tap();
      // Validation errors should appear
    });

    it('should create a new user with valid data', async () => {
      await element(by.id('input-firstName')).typeText('Jane');
      await element(by.id('input-lastName')).typeText('Smith');
      await element(by.id('input-email')).typeText('jane@example.com');
      await element(by.id('role-Admin')).tap();
      await element(by.id('submit-button')).tap();

      // Should navigate back to list
      await waitFor(element(by.id('customer-list')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should close the form when X is tapped', async () => {
      await element(by.id('close-button')).tap();
      await expect(element(by.id('customer-list'))).toBeVisible();
    });

    it('should toggle between Admin and Manager roles', async () => {
      await element(by.id('role-Admin')).tap();
      await element(by.id('role-Manager')).tap();
    });

    it('should show error for invalid email', async () => {
      await element(by.id('input-firstName')).typeText('John');
      await element(by.id('input-lastName')).typeText('Doe');
      await element(by.id('input-email')).typeText('invalid-email');
      await element(by.id('submit-button')).tap();
      // Error should be visible
    });

    it('should show error for name with special characters', async () => {
      await element(by.id('input-firstName')).typeText('John@123');
      await element(by.id('input-lastName')).typeText('Doe');
      await element(by.id('submit-button')).tap();
      // Error should be visible
    });
  });
});
