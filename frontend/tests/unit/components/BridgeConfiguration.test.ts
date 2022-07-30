import { shallowMount } from '@vue/test-utils';
import BridgeConfiguration from '@/components/BridgeConfiguration.vue';

describe('BridgeConfiguration.vue', () => {
    test('renders correctly', () => {
        const wrapper = shallowMount(BridgeConfiguration);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
