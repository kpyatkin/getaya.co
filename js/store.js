function OnFsPopupWebhookReceived(data) {
    var license = data.items[0].fulfillments["aya-advanced-annual_license_0"][0].license;
    if (license) {
        window.licenseKey = license;
    }
}

function onFsPopupClosed(orderReference) {
    if (orderReference) {
        var licenseKey = window.licenseKey;
        window.location.replace("https://getaya.co/thankyou.html?licenseKey=" + (licenseKey ? licenseKey : ""));
    }
}