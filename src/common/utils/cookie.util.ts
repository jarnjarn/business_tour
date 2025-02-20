export class CookieUtil {
    // Hàm để thiết lập cookie với tên, giá trị và số ngày hết hạn
    static setCookie(name: string, value: string, days: number = 999) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Thời gian hết hạn cookie
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`; // Thiết lập cookie
    }

    // Hàm để lấy giá trị của cookie dựa trên tên
    static getCookie(name: string) {
        const nameEQ = `${name}=`;
        const cookiesArray = document.cookie.split(';'); // Tách các cookie
        for (let i = 0; i < cookiesArray.length; i++) {
            let cookie = cookiesArray[i].trim(); // Loại bỏ khoảng trắng
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length); // Trả về giá trị của cookie
            }
        }
        return null; // Trả về null nếu không tìm thấy cookie
    }
    static removeCookie(name: string) {
        // Để xóa cookie, chúng ta đặt ngày hết hạn về quá khứ
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }

}
