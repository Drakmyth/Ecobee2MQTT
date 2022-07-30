import { shallowMount } from '@vue/test-utils';
import EcobeeConfiguration from '@/components/EcobeeConfiguration.vue';

describe('EcobeeConfiguration.vue', () => {
    test('renders correctly', () => {
        const wrapper = shallowMount(EcobeeConfiguration);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
