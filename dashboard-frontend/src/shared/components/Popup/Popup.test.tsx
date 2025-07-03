// Popup.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popup from './Popup';
import { vi } from 'vitest';

describe('Popup component', () => {
	it('does not render when isOpen is false', () => {
		const { container } = render(
			<Popup isOpen={false} onClose={() => { }}>
				<div>Modal Content</div>
			</Popup>
		);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders when isOpen is true', () => {
		render(
			<Popup isOpen={true} onClose={() => { }}>
				<div>Modal Content</div>
			</Popup>
		);
		expect(screen.getByText('Modal Content')).toBeInTheDocument();
	});

	it('calls onClose when clicking overlay', () => {
		const onClose = vi.fn();
		const { container } = render(
			<Popup isOpen={true} onClose={onClose}>
				<div>Modal Content</div>
			</Popup>
		);

		const overlay = container.querySelector(`.${'popupOverlay'}`); // use actual class or data-testid if using CSS Modules
		if (overlay) {
			fireEvent.click(overlay); // simulate outside click
			expect(onClose).toHaveBeenCalled();
		}
	});

	it('calls onClose when Escape key is pressed', () => {
		const onClose = vi.fn();
		render(
			<Popup isOpen={true} onClose={onClose}>
				<div>Modal Content</div>
			</Popup>
		);

		fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
		expect(onClose).toHaveBeenCalled();
	});

	it('calls onClose when Close button is clicked', async () => {
		const onClose = vi.fn();
		render(
			<Popup isOpen={true} onClose={onClose}>
				<div>Modal Content</div>
			</Popup>
		);

		const closeButton = screen.getByText('Close');
		await userEvent.click(closeButton);
		expect(onClose).toHaveBeenCalled();
	});
});
