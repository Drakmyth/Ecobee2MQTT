import { shallowMount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';

describe('HomeView.vue', () => {
    test('renders correctly', () => {
        const wrapper = shallowMount(HomeView);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
