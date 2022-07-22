# Ecobee2MQTT
[![License](https://img.shields.io/github/license/Drakmyth/Ecobee2MQTT)](https://github.com/Drakmyth/Ecobee2MQTT/blob/master/LICENSE.md)

Ecobee2MQTT facilitates retrieving data from and sending commands to your Ecobee thermostat and any connected sensors using MQTT messages. It functions as a bridge between the Ecobee Cloud Server Developer API and an MQTT broker. There is also built-in support for Home Assistant MQTT Discovery.

## Installation
### Register as an Ecobee developer
1. Click the `Become a developer` button on the [Ecobee Developer website](https://www.ecobee.com/en-us/developers).
1. Log in using your Ecobee credentials.
    - You may need to disable your MFA if you have that enabled. You can do so through the iOS or Android mobile apps. You can re-enable MFA after you are registered as a developer.
1. Accept the SDK agreement.
1. Fill out the form and click the `save` button.

### Create the Ecobee2MQTT application
1. Login to [ecobee.com](https://www.ecobee.com/en-us/).
1. Click the person icon in the upper-right corner.
1. Select `Developer` from the sidebar.
1. Click `Create New` and fill out the form.
    1. Application Name: (This can be anything but needs to be unique across all Ecobee users)
        > \<username>-ecobee2mqtt
    1. Application Summary:
        > Allows communication to and from an MQTT broker.
    1. Authorization Method:
        > ecobee PIN
    1. Application Icon: [developer-logo.png](./logo/developer-logo.png)
    1. Detailed Description:
        > A software bridge to access sensor data and allow communication with Ecobee APIs via MQTT topics.
1. Click `Save`.

### Configure and run Ecobee2MQTT service
1. TBD

## Limitations
Due to restrictions set by the Ecobee API, there are some restrictions to be aware of:
- Internet access and more specifically a connection to the Ecobee Server is required. Local-only control is not possible.
    - Although local control is potentially possible via HomeKit, this requires an Apple/iOS ecosystem. Support for this will be investigated after API support has been fully implemented.
- The Ecobee API has a polling limitation of once every 3 minutes, thus this is the fastest new data can be retrieved.

## Issues
If you come across something that seems like a bug, please report it here. Make sure to follow these guidelines to ensure your report isn't closed as "Invalid":

* Make sure you are using the latest Release version of Ecobee2MQTT. Old versions of the service are unsupported. Features and fixes will not be backported to old versions.
* Search to see if someone else has already reported the bug. Duplicate reports just slow down getting things fixed.
* Include steps to reproduce the issue in your report. Screenshots or videos may also prove helpful.


## Contributions
This service is open source! That means if you'd like to try your hand at fixing a bug or implementing a feature, please do so! Head over to the Issues page and look for any open issues tagged with the "Accepting PRs" label. Fork this repo, create a branch, work on it, then submit a pull request. We'll work together to iron out any concerns with your code, and then we'll merge it in and your code will become a part of Ecobee2MQTT's legacy!

## License
Ecobee2MQTT is licensed under the MIT License (MIT). See [LICENSE](./LICENSE.md) for details.