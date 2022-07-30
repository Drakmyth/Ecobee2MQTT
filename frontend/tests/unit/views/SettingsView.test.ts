import { shallowMount } from '@vue/test-utils';
import SettingsView from '@/views/SettingsView.vue';

describe('SettingsView.vue', () => {
    test('renders correctly', () => {
        const wrapper = shallowMount(SettingsView);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
