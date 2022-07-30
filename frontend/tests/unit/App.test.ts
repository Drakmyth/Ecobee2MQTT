import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App.vue', () => {
    test('renders correctly', () => {
        const wrapper = shallowMount(App);
        expect(wrapper.html()).toMatchSnapshot();
    });
});