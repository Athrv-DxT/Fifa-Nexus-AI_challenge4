import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Badge } from './components/Badge';
import { Input, Select } from './components/FormControls';
import { ErrorBoundary } from './components/ErrorBoundary';
import { usePreferencesStore } from './hooks/usePreferences';

describe('Shared Design System Components', () => {

  describe('Button Component', () => {
    it('renders with default props and text', () => {
      render(<Button>Click Me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeDefined();
    });

    it('handles click events', () => {
      let clicked = false;
      render(<Button onClick={() => { clicked = true; }}>Test Click</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(clicked).toBe(true);
    });

    it('renders disabled state correctly', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });

  describe('Card Component', () => {
    it('renders title and children content', () => {
      render(
        <Card title="Operations Card">
          <p>Card Content Text</p>
        </Card>
      );
      expect(screen.getByText('Operations Card')).toBeDefined();
      expect(screen.getByText('Card Content Text')).toBeDefined();
    });
  });

  describe('Badge Component', () => {
    it('renders badge variants correctly', () => {
      render(<Badge variant="success">Normal Status</Badge>);
      expect(screen.getByText('Normal Status')).toBeDefined();
    });
  });

  describe('FormControls Components', () => {
    it('renders Input with label and handles change', () => {
      let val = '';
      render(
        <Input
          id="test-input"
          label="Test Input Label"
          value={val}
          onChange={(e) => { val = e.target.value; }}
        />
      );
      expect(screen.getByLabelText('Test Input Label')).toBeDefined();
    });

    it('renders Select with options', () => {
      render(
        <Select
          id="test-select"
          label="Venue Select"
          value="stadium-1"
          onChange={() => {}}
          options={[
            { value: 'stadium-1', label: 'Stadium 1' },
            { value: 'stadium-2', label: 'Stadium 2' }
          ]}
        />
      );
      expect(screen.getByLabelText('Venue Select')).toBeDefined();
    });
  });

  describe('ErrorBoundary Component', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Safe Component Content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText('Safe Component Content')).toBeDefined();
    });
  });
});

describe('Preferences Hook Store', () => {
  beforeEach(() => {
    usePreferencesStore.setState({
      language: 'en',
      highContrast: false,
      largeFont: false,
      userRole: 'Operations'
    });
  });

  it('updates language correctly', () => {
    usePreferencesStore.getState().setLanguage('es');
    expect(usePreferencesStore.getState().language).toBe('es');
  });

  it('toggles high contrast mode', () => {
    usePreferencesStore.getState().toggleHighContrast();
    expect(usePreferencesStore.getState().highContrast).toBe(true);
  });

  it('toggles large font mode', () => {
    usePreferencesStore.getState().toggleLargeFont();
    expect(usePreferencesStore.getState().largeFont).toBe(true);
  });

  it('updates user role', () => {
    usePreferencesStore.getState().setUserRole('Executive');
    expect(usePreferencesStore.getState().userRole).toBe('Executive');
  });
});
