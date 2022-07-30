import { shallowMount } from '@vue/test-utils';
import MQTTConfiguration from '@/components/MQTTConfiguration.vue';

describe('MQTTConfiguration.vue', () => {
    test('renders correctly', () => {
        const wrapper = shallowMount(MQTTConfiguration);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
