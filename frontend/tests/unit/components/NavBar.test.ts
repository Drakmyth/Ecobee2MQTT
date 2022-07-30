import { shallowMount } from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';

describe('NavBar.vue', () => {
    test('renders correctly', () => {
        const wrapper = shallowMount(NavBar);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
