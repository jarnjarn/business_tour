'use client';

export function AboutContent() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-center text-lime-700">Về Chúng Tôi</h1>

            <p className="text-lg text-gray-700 text-justify">
                Chào mừng bạn đến với nền tảng của chúng tôi! Chúng tôi là một đội ngũ đam mê công nghệ, luôn nỗ lực để mang đến những sản phẩm và dịch vụ chất lượng cao, phục vụ cộng đồng người dùng tại Việt Nam và toàn thế giới.
            </p>

            <section>
                <h2 className="text-2xl font-semibold text-lime-600 mb-2">Sứ mệnh</h2>
                <p className="text-gray-700">
                    Sứ mệnh của chúng tôi là tạo ra một nền tảng đáng tin cậy, thân thiện với người dùng và luôn đổi mới để đáp ứng nhu cầu ngày càng phát triển của xã hội số.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-lime-600 mb-2">Giá trị cốt lõi</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Chất lượng và độ tin cậy</li>
                    <li>Minh bạch và trách nhiệm</li>
                    <li>Đổi mới và sáng tạo</li>
                    <li>Hướng tới cộng đồng</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-lime-600 mb-2">Liên hệ</h2>
                <p className="text-gray-700">
                    Nếu bạn có bất kỳ câu hỏi, góp ý hoặc muốn hợp tác, hãy liên hệ với chúng tôi qua email: <a href="mailto:contact@example.com" className="text-blue-600 underline">contact@example.com</a>.
                </p>
            </section>
        </div>
    );
}
