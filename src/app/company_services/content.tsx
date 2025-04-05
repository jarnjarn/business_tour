'use client';

export function ServiceContent() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-center text-emerald-700">Dịch Vụ Của Chúng Tôi</h1>

            <p className="text-lg text-gray-700 text-justify">
                Chúng tôi cung cấp đa dạng các dịch vụ nhằm mang đến cho khách hàng những trải nghiệm tuyệt vời nhất, từ việc khám phá đến mua sắm sản phẩm chất lượng.
            </p>

            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-semibold text-emerald-600">1. Tham Quan</h2>
                    <p className="text-gray-700">
                        Khám phá không gian và quy trình sản xuất độc đáo của chúng tôi thông qua các tour tham quan được thiết kế đặc biệt cho khách cá nhân, nhóm hoặc trường học.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-emerald-600">2. Mua Sản Phẩm Tại Chỗ</h2>
                    <p className="text-gray-700">
                        Tại khu vực trưng bày, bạn có thể chọn mua các sản phẩm thủ công, đặc sản hoặc quà lưu niệm độc quyền mà chỉ có tại đây.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-emerald-600">3. Đặt Hàng Trực Tuyến</h2>
                    <p className="text-gray-700">
                        Bạn có thể đặt hàng mọi lúc mọi nơi thông qua website chính thức của chúng tôi, với các chương trình ưu đãi và hỗ trợ giao hàng toàn quốc.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-emerald-600">4. Trải Nghiệm Làm Thủ Công</h2>
                    <p className="text-gray-700">
                        Tham gia các buổi workshop để trực tiếp tạo ra sản phẩm thủ công của riêng mình dưới sự hướng dẫn của các nghệ nhân.
                    </p>
                </div>
            </div>

            <p className="text-center text-gray-600 italic mt-6">
                Mọi dịch vụ đều có thể được đặt trước qua website hoặc liên hệ trực tiếp với chúng tôi để được tư vấn chi tiết.
            </p>
        </div>
    );
}
