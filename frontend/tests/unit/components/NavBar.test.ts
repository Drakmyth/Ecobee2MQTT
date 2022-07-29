import { shallowMount } from '@vue/test-utils';
import NavBar from '@/components/NavBar.vue';

describe('NavBar.vue', () => {
    test('renders props.msg when passed', () => {
        const msg = 'Ecobee2MQTT';
        const wrapper = shallowMount(NavBar, {
            props: { msg },
        });
        expect(wrapper.text()).toMatch(msg);
    });
});