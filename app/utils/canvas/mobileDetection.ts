export const isMobileDevice = (): boolean => {
    if (typeof navigator === 'undefined') return false;

    const userAgent = navigator.userAgent.toLowerCase();

    const mobileKeywords = [
        'mobile',
        'android',
        'iphone',
        'ipad',
        'ipod',
        'blackberry',
        'windows phone',
        'webos',
        'opera mini',
        'iemobile',
    ];

    if (mobileKeywords.some((keyword) => userAgent.includes(keyword))) {
        return true;
    }

    if (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        return true;
    }

    return false;
};
