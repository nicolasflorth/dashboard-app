import { Meta, StoryObj } from '@storybook/react';
import LoginPage from './LoginPage';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { MemoryRouter } from 'react-router-dom';

// Mock fetch from Storybook
if (import.meta.env.MODE === 'storybook') {
    window.fetch = async () =>
        new Response(
            JSON.stringify({
                id: 1,
                firstName: 'Emily',
                lastName: 'Test',
                email: 'test@test.com',
                roles: ['User'],
                accessTocken: 'fake-token'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
}

const meta: Meta<typeof LoginPage> = {
    title: 'Pages/LoginPage',
    component: LoginPage,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Provider store={store}>
                    <Story />
                </Provider>
            </MemoryRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof LoginPage>;
export const Default: Story = {
    args: {},
    parameters: {
        // Disable the viewport addon for this story
        viewport: { disable: true },
    },
};