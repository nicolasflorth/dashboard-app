import type { Meta, StoryObj } from '@storybook/react';
import LogoutButton from './LogoutButton';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

const meta: Meta<typeof LogoutButton> = {
  title: 'Components/LogoutButton',
  component: LogoutButton,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LogoutButton>;

export const Default: Story = {};
