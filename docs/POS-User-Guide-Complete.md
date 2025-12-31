# POS Bán Hàng - Hướng Dẫn Sử Dụng Toàn Diện

---

**Phiên bản:** 1.0.0  
**Cập nhật lần cuối:** 31/12/2025  
**Đối tượng sử dụng:** Nhân viên thu ngân, Quản lý cửa hàng, Admin  
**Ngôn ngữ:** Tiếng Việt  

---

## Mục Lục

1. [Giới Thiệu](#1-giới-thiệu)
2. [Bắt Đầu Sử Dụng](#2-bắt-đầu-sử-dụng)
3. [Giao Diện Người Dùng](#3-giao-diện-người-dùng)
4. [Tính Năng Cốt Lõi](#4-tính-năng-cốt-lõi)
5. [Tính Năng Nâng Cao](#5-tính-năng-nâng-cao)
6. [Cài Đặt & Cấu Hình](#6-cài-đặt--cấu-hình)
7. [Xử Lý Sự Cố](#7-xử-lý-sự-cố)
8. [FAQ & Thực Hành Tốt Nhất](#8-faq--thực-hành-tốt-nhất)
9. [Phụ Lục](#9-phụ-lục)

---

## 1. Giới Thiệu

### 1.1 Hệ Thống POS Là Gì?

**Fast POS** là hệ thống quản lý bán hàng hiện đại, được thiết kế với giao diện Glassmorphism sang trọng và thân thiện. Hệ thống giúp quản lý toàn diện hoạt động kinh doanh từ bán hàng, thanh toán, tồn kho đến quản lý nhân sự và khách hàng.

### 1.2 Lợi Ích Chính

| Lợi ích | Mô tả |
|---------|-------|
| ⚡ **Nhanh chóng** | Xử lý đơn hàng trong vài giây |
| 🎯 **Chính xác** | Tính toán tự động, giảm sai sót |
| 📊 **Báo cáo thời gian thực** | Theo dõi doanh thu mọi lúc |
| 👥 **Quản lý khách hàng** | Chương trình khách hàng thân thiết |
| 📦 **Quản lý tồn kho** | Cảnh báo hết hàng tự động |
| 🔐 **Bảo mật** | Phân quyền theo vai trò |

### 1.3 Yêu Cầu Hệ Thống

- **Trình duyệt:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Thiết bị:** Máy tính, tablet, hoặc điện thoại
- **Màn hình:** Tối thiểu 1024x768 pixels
- **Kết nối:** Internet ổn định (tối thiểu 5 Mbps)

### 1.4 Các Module Chính

```
┌─────────────────────────────────────────────────────────────┐
│                    FAST POS SYSTEM                          │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  📍 POS      │  📊 Dashboard │  🪑 Tables   │  📋 Orders    │
├──────────────┼──────────────┼──────────────┼───────────────┤
│  📦 Inventory│  💰 Finance  │  👥 Staff    │  🛒 Customers │
├──────────────┼──────────────┼──────────────┼───────────────┤
│  🎁 Promotions│ 🏭 Suppliers│  ⚙️ Settings │  🏢 Enterprise│
└──────────────┴──────────────┴──────────────┴───────────────┘
```

---

## 2. Bắt Đầu Sử Dụng

### 2.1 Đăng Nhập Hệ Thống

**Bước 1:** Mở trình duyệt và truy cập địa chỉ hệ thống

**Bước 2:** Màn hình khóa nhân viên hiển thị
- Chọn nhân viên từ danh sách avatar
- Nhập mã PIN (4 số)

**Bước 3:** Nhấn **[Đăng nhập]** hoặc Enter

> [!TIP]
> Mã PIN mặc định cho Admin: `1234`, Cashier: `0000`

**Bước 4:** Sau khi đăng nhập thành công:
- Hệ thống tự động ghi nhận giờ vào ca
- Dashboard hiển thị với thông tin tổng quan

### 2.2 Các Vai Trò Trong Hệ Thống

| Vai trò | Quyền hạn |
|---------|-----------|
| **Admin** | Toàn quyền hệ thống |
| **Manager** | Quản lý cửa hàng, duyệt hoàn trả |
| **Cashier** | Bán hàng, thanh toán |
| **Waiter** | Phục vụ bàn, gọi món |
| **Kitchen** | Xem đơn hàng chế biến |

### 2.3 Giao Dịch Đầu Tiên - Hướng Dẫn Nhanh

```
   [1] Chọn sản phẩm    →    [2] Thêm vào giỏ    →    [3] Thanh toán
         ⬇                         ⬇                       ⬇
   Tìm kiếm/Danh mục         Điều chỉnh SL           Chọn phương thức
         ⬇                         ⬇                       ⬇
   Click [+] hoặc          Áp dụng chiết khấu        In hóa đơn ✓
   Double-click                 (nếu có)
```

**Chi tiết từng bước:**

1. **Tìm sản phẩm:**
   - Sử dụng thanh tìm kiếm (nhập tên/mã)
   - Hoặc duyệt theo danh mục (Coffee, Tea, Snacks...)

2. **Thêm vào giỏ:**
   - Click nút [+] trên sản phẩm
   - Hoặc double-click vào sản phẩm
   - Số lượng mặc định = 1

3. **Kiểm tra giỏ hàng:**
   - Xem danh sách sản phẩm bên phải
   - Điều chỉnh số lượng: [−] [+]
   - Xóa sản phẩm: [×]

4. **Thanh toán:**
   - Nhấn nút **[THANH TOÁN]** màu xanh
   - Chọn phương thức: Tiền mặt, Thẻ, QR, Chuyển khoản
   - Xác nhận và in hóa đơn

---

## 3. Giao Diện Người Dùng

### 3.1 Bố Cục Tổng Thể

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]     Fast POS        🔔 Notifications    👤 User  ⚙️    │  ← Header
├─────┬───────────────────────────────────────┬───────────────────┤
│     │                                       │                   │
│  📊 │     PRODUCT AREA                      │   CART SIDEBAR    │
│  🛒 │     (Danh sách sản phẩm)              │   (Giỏ hàng)      │
│  📋 │                                       │                   │
│  📦 │  ┌────┐  ┌────┐  ┌────┐  ┌────┐     │   Item 1    ₫XX   │
│  💰 │  │ P1 │  │ P2 │  │ P3 │  │ P4 │     │   Item 2    ₫XX   │
│  👥 │  └────┘  └────┘  └────┘  └────┘     │   ─────────────   │
│  ⚙️ │                                       │   Tổng:     ₫XX   │
│     │                                       │   [THANH TOÁN]    │
├─────┴───────────────────────────────────────┴───────────────────┤
│  Sidebar (Menu điều hướng)                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Thanh Header

| Thành phần | Chức năng |
|------------|-----------|
| **Logo** | Về trang Dashboard |
| **Tên cửa hàng** | Hiển thị chi nhánh hiện tại |
| **🔔 Thông báo** | Cảnh báo tồn kho, đơn hàng mới |
| **👤 Avatar** | Thông tin nhân viên đang đăng nhập |
| **⚙️ Cài đặt** | Truy cập nhanh cài đặt |
| **🚪 Đăng xuất** | Kết thúc ca làm việc |

### 3.3 Menu Điều Hướng (Sidebar)

```
┌────────────────────┐
│ 📊 Dashboard       │  → Tổng quan doanh thu
│ 🛒 POS             │  → Màn hình bán hàng
│ 🪑 Tables          │  → Quản lý bàn/đặt chỗ
│ 📋 Orders          │  → Lịch sử đơn hàng
│ 📦 Inventory       │  → Quản lý tồn kho
│ 🏭 Procurement     │  → Mua hàng/nhập kho
│ 💰 Finance         │  → Tài chính/chi phí
│ 👥 Staff           │  → Nhân sự/chấm công
│ 🛒 Customers       │  → Khách hàng/loyalty
│ 🎁 Promotions      │  → Khuyến mãi
│ ⚙️ Settings        │  → Cài đặt hệ thống
└────────────────────┘
```

### 3.4 Khu Vực Sản Phẩm

**Thanh tìm kiếm:**
- Nhập tên sản phẩm để tìm nhanh
- Hỗ trợ tìm theo mã barcode
- Kết quả hiển thị realtime

**Danh mục (Category tabs):**
```
[All] [☆ Favorites] [Coffee] [Tea] [Snacks] [Desserts]
```

**Thẻ sản phẩm (Product Card):**
```
┌─────────────────┐
│   [Hình ảnh]    │
│   ☆ Favorite    │
├─────────────────┤
│ Tên sản phẩm    │
│ ₫XX,XXX         │ ← Giá (màu nổi bật)
│ [+] Thêm        │
└─────────────────┘
```

**Chỉ báo tồn kho:**
- 🟢 **Còn hàng** - Đủ số lượng
- 🟡 **Sắp hết** - ≤ 10 sản phẩm
- 🔴 **Hết hàng** - Không thể thêm vào giỏ

### 3.5 Thanh Giỏ Hàng (Cart Sidebar)

```
┌───────────────────────────────┐
│  🛒 GIỎ HÀNG (3 items)        │
├───────────────────────────────┤
│  Espresso         ₫35,000     │
│  [−] 2 [+]                [×] │
├───────────────────────────────┤
│  Latte            ₫55,000     │
│  [−] 1 [+]                [×] │
├───────────────────────────────┤
│                               │
│  Tạm tính:        ₫125,000    │
│  Chiết khấu:      -₫12,500    │
│  Thuế (8%):       ₫9,000      │
├───────────────────────────────┤
│  TỔNG CỘNG:       ₫121,500    │
│                               │
│  [💾 Lưu nháp] [✂️ Tách bill] │
│                               │
│  [    💳 THANH TOÁN    ]      │
└───────────────────────────────┘
```

**Các nút chức năng:**

| Nút | Chức năng |
|-----|-----------|
| **[−]** | Giảm số lượng 1 |
| **[+]** | Tăng số lượng 1 |
| **[×]** | Xóa sản phẩm khỏi giỏ |
| **[💾 Lưu nháp]** | Lưu đơn hàng chờ xử lý |
| **[✂️ Tách bill]** | Chia bill cho nhiều người |
| **[💳 THANH TOÁN]** | Tiến hành thanh toán |

### 3.6 Ý Nghĩa Màu Sắc

| Màu | Ý nghĩa |
|-----|---------|
| 🟢 **Xanh lá** | Thành công, còn hàng, đã duyệt |
| 🔴 **Đỏ** | Lỗi, hết hàng, từ chối |
| 🟡 **Vàng** | Cảnh báo, đang chờ, sắp hết |
| 🔵 **Xanh dương** | Thông tin, đang xử lý |
| ⚪ **Xám** | Không khả dụng, đã hủy |

---

## 4. Tính Năng Cốt Lõi

### 4.1 Tìm Kiếm & Duyệt Sản Phẩm

#### Phương thức 1: Tìm theo tên

1. Click vào thanh tìm kiếm (hoặc nhấn `/`)
2. Nhập tên sản phẩm: "Espresso", "Latte"
3. Kết quả hiển thị ngay khi gõ
4. Click chọn sản phẩm mong muốn

> [!TIP]
> Chỉ cần gõ vài ký tự đầu, ví dụ: "esp" → "Espresso"

#### Phương thức 2: Tìm theo mã Barcode

1. Focus vào thanh tìm kiếm
2. Quét mã barcode bằng máy quét
3. Sản phẩm tự động được chọn
4. Nhấn Enter để thêm vào giỏ

#### Phương thức 3: Duyệt theo danh mục

1. Click vào tab danh mục: `[Coffee]`, `[Tea]`...
2. Danh sách sản phẩm được lọc
3. Cuộn để xem thêm sản phẩm
4. Click [+] để thêm vào giỏ

#### Phương thức 4: Sản phẩm yêu thích

1. Click tab `[☆ Favorites]`
2. Xem danh sách sản phẩm đã đánh dấu
3. Đánh dấu yêu thích: Click ☆ trên thẻ sản phẩm

### 4.2 Thêm Sản Phẩm Vào Giỏ

#### Cách 1: Nút [+]
1. Tìm sản phẩm trong danh sách
2. Click nút [+] trên thẻ sản phẩm
3. Số lượng = 1 được thêm vào giỏ
4. Nếu sản phẩm có tùy chọn → Popup hiện ra

#### Cách 2: Double-click
1. Tìm sản phẩm
2. Double-click vào thẻ sản phẩm
3. Thêm nhanh với số lượng = 1

**Nếu sản phẩm có thuộc tính (Size, Topping...):**
```
┌─────────────────────────────────┐
│  Customization                  │
├─────────────────────────────────┤
│  Size:   [S] [M] [L]            │
│  Sugar:  [0%] [50%] [100%]      │
│  Ice:    [Less] [Normal] [More] │
│                                 │
│  Ghi chú: [________________]    │
│                                 │
│  [Hủy]        [Thêm vào giỏ]    │
└─────────────────────────────────┘
```

### 4.3 Quản Lý Giỏ Hàng

#### Tăng/Giảm số lượng

1. Tìm sản phẩm trong giỏ hàng
2. Click [−] để giảm, [+] để tăng
3. Nếu số lượng = 0 → Sản phẩm bị xóa
4. Tổng tiền tự động cập nhật

#### Xóa sản phẩm

1. Click nút [×] bên cạnh sản phẩm
2. Xác nhận xóa (nếu được yêu cầu)
3. Sản phẩm biến mất khỏi giỏ

#### Xóa toàn bộ giỏ hàng

1. Click nút [🗑️ Xóa giỏ]
2. Xác nhận: "Bạn có chắc muốn xóa toàn bộ?"
3. Click [Đồng ý] → Giỏ hàng trống

#### Thêm ghi chú cho sản phẩm

1. Click vào icon 📝 bên cạnh sản phẩm
2. Nhập ghi chú: "Ít đường", "Không đá"
3. Click [Lưu]

### 4.4 Áp Dụng Chiết Khấu

#### Loại 1: Chiết khấu phần trăm (%)

1. Click vào khu vực "Chiết khấu" trong giỏ hàng
2. Chọn tab [%]
3. Nhập số phần trăm: `10` (cho 10%)
4. Nhấn Enter hoặc Click [Áp dụng]

**Công thức:**
```
Số tiền giảm = Tạm tính × Phần trăm / 100
Ví dụ: 100,000đ × 10% = 10,000đ được giảm
```

#### Loại 2: Chiết khấu cố định (₫)

1. Click khu vực "Chiết khấu"
2. Chọn tab [₫]
3. Nhập số tiền: `50000` (cho 50,000đ)
4. Áp dụng

#### Loại 3: Mã voucher

1. Click tab [Voucher]
2. Nhập mã: `SAVE20`
3. Click [Áp dụng]
4. Kết quả:
   - ✅ Hợp lệ: Chiết khấu được áp dụng
   - ❌ Không hợp lệ: Thông báo lỗi

> [!IMPORTANT]
> Mỗi đơn hàng chỉ áp dụng được **MỘT** loại chiết khấu.

### 4.5 Quy Trình Thanh Toán

#### Bước 1: Kiểm tra giỏ hàng

- Xác nhận danh sách sản phẩm đúng
- Kiểm tra số lượng
- Kiểm tra chiết khấu (nếu có)

#### Bước 2: Nhấn [THANH TOÁN]

- Popup thanh toán xuất hiện
- Hiển thị tổng kết đơn hàng:

```
┌─────────────────────────────────┐
│      THANH TOÁN                 │
├─────────────────────────────────┤
│  Tạm tính:        ₫125,000      │
│  Chiết khấu:      -₫12,500      │
│  Thuế (8%):       ₫9,000        │
│  ─────────────────────────────  │
│  TỔNG CỘNG:       ₫121,500      │
├─────────────────────────────────┤
│  Phương thức thanh toán:        │
│                                 │
│  [💵 Tiền mặt]  [💳 Thẻ]        │
│  [📱 QR Code]   [🏦 Chuyển khoản]│
└─────────────────────────────────┘
```

#### Bước 3: Chọn phương thức thanh toán

Xem chi tiết từng phương thức ở mục 4.6

#### Bước 4: Xác nhận & In hóa đơn

- Thanh toán thành công → Thông báo ✅
- Hóa đơn tự động in (nếu có máy in)
- Giỏ hàng được reset

### 4.6 Các Phương Thức Thanh Toán

#### 💵 TIỀN MẶT

1. Chọn [💵 Tiền mặt]
2. Màn hình nhập số tiền hiện ra:
```
Tổng cần trả:  ₫121,500
Tiền nhận:     [__________]
Tiền thối:     ₫0
```

3. Nhập số tiền khách đưa: `150000`
4. Hệ thống tự tính tiền thối: `150,000 - 121,500 = 28,500đ`
5. Click [XÁC NHẬN]
6. Trả tiền thối cho khách

> [!WARNING]
> Nếu tiền nhận < tổng cần trả → Nút xác nhận bị vô hiệu hóa

#### 💳 THẺ TÍN DỤNG/GHI NỢ

1. Chọn [💳 Thẻ]
2. Thông báo: "Vui lòng đưa thẻ vào máy đọc"
3. Khách đưa thẻ/chạm thẻ
4. Chờ xử lý (3-10 giây)
5. Kết quả:
   - ✅ "Giao dịch thành công"
   - ❌ "Giao dịch thất bại: [Lý do]"

6. Nếu thất bại:
   - [Thử lại] - Dùng cùng thẻ
   - [Đổi phương thức] - Chọn cách khác

#### 📱 QR CODE (Momo, ZaloPay, VietQR)

1. Chọn [📱 QR Code]
2. Mã QR hiển thị trên màn hình
3. Khách mở app ngân hàng/ví điện tử
4. Quét mã QR
5. Khách xác nhận trên điện thoại
6. Hệ thống chờ phản hồi (timeout: 5 phút)
7. Khi nhận được thanh toán → Tự động hoàn tất

#### 🏦 CHUYỂN KHOẢN

1. Chọn [🏦 Chuyển khoản]
2. Thông tin tài khoản hiển thị:
```
Ngân hàng:    Vietcombank
Số TK:        1234567890
Chủ TK:       CONG TY ABC
Số tiền:      ₫121,500
Nội dung:     HDxxxxxx
```

3. Khách chuyển khoản qua app bank
4. Xác nhận khi đã nhận được tiền
5. Click [XÁC NHẬN ĐÃ NHẬN]

### 4.7 Hóa Đơn & Biên Lai

#### Nội dung hóa đơn

```
═══════════════════════════════════
        CỬA HÀNG ABC
   123 Đường XYZ, Quận 1, TP.HCM
        ĐT: 0901234567
═══════════════════════════════════
Hóa đơn: HD20251231-001
Ngày: 31/12/2025 - 14:30
Nhân viên: Nguyễn Văn A
───────────────────────────────────
Sản phẩm         SL    Đơn giá   TT
───────────────────────────────────
Espresso          2     35,000   70,000
Latte             1     55,000   55,000
───────────────────────────────────
Tạm tính:                      125,000
Chiết khấu (10%):             -12,500
Thuế (8%):                      9,000
───────────────────────────────────
TỔNG CỘNG:                    121,500
Tiền nhận:                    150,000
Tiền thối:                     28,500
───────────────────────────────────
Phương thức: Tiền mặt

     Cảm ơn quý khách!
       Hẹn gặp lại!
═══════════════════════════════════
```

#### In hóa đơn

- **Tự động:** Sau thanh toán (nếu cấu hình)
- **Thủ công:** Nhấn [🖨️ In hóa đơn]

#### In lại hóa đơn

1. Vào menu [📋 Orders]
2. Tìm đơn hàng cần in lại
3. Click [👁️ Xem chi tiết]
4. Click [🖨️ In lại]

---

## 5. Tính Năng Nâng Cao

### 5.1 Quản Lý Đơn Hàng Nháp

#### Lưu đơn nháp

Khi cần tạm dừng đơn hàng (khách đi lấy thêm đồ...):

1. Click [💾 Lưu nháp] trong giỏ hàng
2. Đặt tên cho đơn nháp: "Bàn 5 - chờ khách"
3. Click [Lưu]
4. Giỏ hàng được reset để phục vụ khách tiếp theo

#### Khôi phục đơn nháp

1. Click icon [📋 Đơn nháp] trên màn hình POS
2. Danh sách đơn nháp hiển thị
3. Click vào đơn cần khôi phục
4. Các sản phẩm được load lại vào giỏ
5. Tiếp tục xử lý bình thường

### 5.2 Tách Bill (Split Order)

Khi nhiều khách muốn thanh toán riêng:

1. Click [✂️ Tách bill]
2. Modal tách bill hiện ra:
```
┌─────────────────────────────────────────┐
│  TÁCH BILL                              │
├──────────────────┬──────────────────────┤
│  BILL CHÍNH      │  BILL PHỤ            │
├──────────────────┼──────────────────────┤
│  Espresso x2     │  [Kéo sản phẩm       │
│  Latte x1        │   vào đây]           │
├──────────────────┼──────────────────────┤
│  Tổng: ₫125,000  │  Tổng: ₫0            │
└──────────────────┴──────────────────────┘
```

3. Kéo thả sản phẩm sang bill phụ
4. Hoặc click sản phẩm để di chuyển
5. Click [Xác nhận tách]
6. Thanh toán từng bill riêng

### 5.3 Lịch Sử Đơn Hàng

#### Xem danh sách đơn hàng

1. Click [📋 Orders] trên menu
2. Danh sách hiển thị với các tab:
   - [Tất cả] - Mọi đơn hàng
   - [Hoàn thành] - Đã thanh toán
   - [Hoàn trả] - Đã hoàn tiền

#### Lọc đơn hàng

- **Theo ngày:** Chọn khoảng thời gian
- **Theo trạng thái:** Completed, Cancelled, Refunded
- **Theo phương thức:** Cash, Card, QR, Transfer
- **Tìm kiếm:** Nhập mã đơn hàng

#### Chi tiết đơn hàng

1. Click vào đơn hàng trong danh sách
2. Modal chi tiết hiển thị:
   - Thông tin đơn hàng
   - Danh sách sản phẩm
   - Thông tin thanh toán
   - Các nút: [🖨️ In lại] [↩️ Hoàn trả]

### 5.4 Hoàn Trả & Hoàn Tiền

#### Quy trình hoàn trả

1. Vào [📋 Orders]
2. Tìm đơn hàng cần hoàn trả
3. Click [↩️ Hoàn trả]
4. Modal hoàn trả hiện ra:

```
┌─────────────────────────────────────────┐
│  HOÀN TRẢ ĐƠN HÀNG                      │
├─────────────────────────────────────────┤
│  Đơn hàng: HD20251231-001               │
├─────────────────────────────────────────┤
│  Sản phẩm cần hoàn trả:                 │
│  ☑ Espresso x2      ₫70,000             │
│  ☐ Latte x1         ₫55,000             │
├─────────────────────────────────────────┤
│  Lý do hoàn trả:                        │
│  [▼ Chọn lý do]                         │
│  ○ Sản phẩm lỗi                         │
│  ○ Khách đổi ý                          │
│  ○ Nhầm sản phẩm                        │
│  ○ Khác                                 │
├─────────────────────────────────────────┤
│  Ghi chú: [________________]            │
├─────────────────────────────────────────┤
│  Số tiền hoàn: ₫70,000                  │
│  Phương thức: [Tiền mặt ▼]              │
├─────────────────────────────────────────┤
│  [Hủy]              [Xác nhận hoàn trả] │
└─────────────────────────────────────────┘
```

5. Chọn sản phẩm cần hoàn trả (tick ☑)
6. Chọn lý do hoàn trả
7. Chọn phương thức hoàn tiền
8. Click [Xác nhận hoàn trả]
9. Nếu cần Manager duyệt → Chờ phê duyệt

> [!CAUTION]
> Hoàn trả cần Manager phê duyệt cho đơn hàng > 500,000đ

### 5.5 Quản Lý Bàn (Tables)

#### Sơ đồ bàn

1. Click [🪑 Tables] trên menu
2. Sơ đồ bàn hiển thị theo khu vực:

```
┌─────────────────────────────────────────┐
│  [Ground Floor ▼]  [+ Thêm bàn]         │
├─────────────────────────────────────────┤
│                                         │
│   🟢 01    🔴 02    🟢 03    🟡 04      │
│   2 ghế   4 ghế    2 ghế   4 ghế       │
│                                         │
│   🟢 05    🟢 06    🔵 07    🟢 08      │
│   6 ghế   4 ghế    4 ghế   2 ghế       │
│                                         │
└─────────────────────────────────────────┘

Chú thích:
🟢 Trống    🔴 Có khách    🟡 Đặt trước    🔵 Chờ thanh toán
```

#### Trạng thái bàn

| Màu | Trạng thái | Ý nghĩa |
|-----|------------|---------|
| 🟢 | Available | Bàn trống, sẵn sàng |
| 🔴 | Occupied | Đang có khách |
| 🟡 | Reserved | Đã đặt trước |
| 🔵 | Pending Payment | Chờ thanh toán |
| ⚪ | Cleaning | Đang dọn dẹp |

#### Gọi món theo bàn

1. Click vào bàn có trạng thái 🔴 Occupied
2. Xem đơn hàng hiện tại
3. Click [+ Thêm món]
4. Chuyển sang màn hình POS với bàn đã chọn
5. Thêm sản phẩm và thanh toán

### 5.6 Đặt Bàn Trước (Reservation)

#### Tạo đặt bàn

1. Click [🪑 Tables]
2. Click [📅 Đặt bàn]
3. Điền thông tin:
   - Tên khách hàng
   - Số điện thoại
   - Ngày & giờ
   - Số khách
   - Ghi chú đặc biệt
4. Chọn bàn phù hợp
5. Click [Xác nhận đặt bàn]

#### Quản lý đặt bàn

- Xem lịch đặt bàn theo ngày/tuần
- Sửa/Hủy đặt bàn
- Check-in khi khách đến
- Gọi món trước (pre-order)

### 5.7 Quản Lý Khách Hàng & Loyalty

#### Thêm khách hàng mới

1. Vào [🛒 Customers]
2. Click [+ Thêm khách hàng]
3. Nhập thông tin:
   - Họ tên (bắt buộc)
   - Số điện thoại (bắt buộc)
   - Email
   - Địa chỉ
4. Click [Lưu]

#### Hạng thành viên (Tiers)

| Hạng | Điểm yêu cầu | Ưu đãi |
|------|--------------|--------|
| 🥉 **Bronze** | 0 | Tích điểm 1% |
| 🥈 **Silver** | 500 | Giảm 2% + Tích điểm |
| 🥇 **Gold** | 2,000 | Giảm 5% + Tích điểm |
| 💎 **Platinum** | 5,000 | Giảm 10% + Tích điểm |

#### Nạp tiền prepaid (Top-up)

1. Chọn khách hàng
2. Click [💳 Nạp tiền]
3. Nhập số tiền nạp
4. Hệ thống tính bonus (nếu có)
5. Xác nhận thanh toán
6. Số dư được cộng vào tài khoản

#### Đổi điểm thưởng

1. Chọn khách hàng
2. Click [🎁 Đổi điểm]
3. Chọn phần thưởng hoặc nhập số điểm
4. Xác nhận đổi
5. Điểm được trừ, khách nhận voucher/giảm giá

---

## 6. Cài Đặt & Cấu Hình

### 6.1 Cài Đặt Cá Nhân

#### Đổi mật khẩu (PIN)

1. Click avatar góc trên phải
2. Chọn [⚙️ Đổi mật khẩu]
3. Nhập PIN hiện tại
4. Nhập PIN mới (4 số)
5. Xác nhận PIN mới
6. Click [Lưu]

#### Đổi giao diện

1. Vào [⚙️ Settings] → [🎨 Branding]
2. Chọn màu chủ đạo
3. Chọn font chữ
4. Xem trước thay đổi
5. Click [Lưu cài đặt]

### 6.2 Cài Đặt Cửa Hàng (Manager/Admin)

#### Thông tin cửa hàng

- Tên cửa hàng
- Địa chỉ
- Số điện thoại
- Logo
- Mã số thuế

#### Cấu hình thuế

- Thuế suất mặc định (8%, 10%)
- Thuế theo danh mục sản phẩm
- Hiển thị/Ẩn thuế trên hóa đơn

#### Cấu hình máy in

1. Vào [⚙️ Settings] → [🖨️ Hardware]
2. Chọn loại máy in:
   - Thermal 80mm
   - A4 Printer
3. Cấu hình kết nối
4. In thử

### 6.3 Quản Lý Phương Thức Thanh Toán

1. Vào [⚙️ Settings] → [💳 Payments]
2. Bật/Tắt từng phương thức:
   - ☑ Tiền mặt
   - ☑ Thẻ
   - ☑ QR Code
   - ☑ Chuyển khoản
3. Cấu hình chi tiết từng phương thức
4. Lưu cài đặt

---

## 7. Xử Lý Sự Cố

### 7.1 Sự Cố Thường Gặp

#### ❌ Không tìm thấy sản phẩm

**Nguyên nhân:**
- Sai từ khóa tìm kiếm
- Sản phẩm chưa được thêm vào hệ thống
- Sản phẩm bị ẩn/khóa

**Giải pháp:**
1. Thử tìm với từ khóa khác
2. Kiểm tra bộ lọc danh mục
3. Liên hệ Manager để kiểm tra sản phẩm

---

#### ❌ Giỏ hàng không cập nhật

**Nguyên nhân:**
- Lỗi trình duyệt
- Mất kết nối

**Giải pháp:**
1. Refresh trang (F5)
2. Xóa cache trình duyệt
3. Đăng xuất và đăng nhập lại

---

#### ❌ Thanh toán thẻ thất bại

**Nguyên nhân:**
- Thẻ không đủ số dư
- Thẻ hết hạn
- Máy đọc thẻ lỗi

**Giải pháp:**
1. Thử lại lần nữa
2. Yêu cầu khách dùng thẻ khác
3. Chuyển sang phương thức thanh toán khác
4. Kiểm tra kết nối máy đọc thẻ

---

#### ❌ Mã voucher không hoạt động

**Nguyên nhân:**
- Voucher đã hết hạn
- Đã hết lượt sử dụng
- Không đạt điều kiện áp dụng

**Giải pháp:**
1. Kiểm tra thời hạn voucher
2. Kiểm tra điều kiện đơn hàng tối thiểu
3. Thử voucher khác

---

#### ❌ Máy in không hoạt động

**Nguyên nhân:**
- Hết giấy
- Mất kết nối
- Driver lỗi

**Giải pháp:**
1. Kiểm tra giấy in
2. Kiểm tra cáp kết nối
3. Restart máy in
4. Liên hệ IT support

---

#### ❌ Không đăng nhập được

**Nguyên nhân:**
- Sai PIN
- Tài khoản bị khóa
- Lỗi hệ thống

**Giải pháp:**
1. Kiểm tra Caps Lock
2. Thử lại cẩn thận
3. Liên hệ Manager để reset PIN
4. Kiểm tra trạng thái tài khoản

---

### 7.2 Liên Hệ Hỗ Trợ

| Loại hỗ trợ | Liên hệ |
|-------------|---------|
| **Hotline 24/7** | 1900-xxxx |
| **Email** | support@fastpos.vn |
| **Chat trong app** | Click 💬 góc phải |

---

## 8. FAQ & Thực Hành Tốt Nhất

### 8.1 Câu Hỏi Thường Gặp

**Q: Làm sao để giao dịch nhanh hơn?**
> A: Sử dụng quét barcode, đánh dấu sản phẩm yêu thích, và chuẩn bị sẵn phương thức thanh toán.

**Q: Có thể in lại hóa đơn không?**
> A: Có. Vào Lịch sử đơn hàng → Chọn đơn → In lại.

**Q: Khách đổi ý về phương thức thanh toán?**
> A: Trước khi xác nhận, nhấn [← Quay lại] và chọn phương thức khác.

**Q: Thuế được tính như thế nào?**
> A: Thuế = (Tạm tính - Chiết khấu) × Thuế suất (mặc định 8%)

**Q: Dữ liệu có được bảo mật không?**
> A: Có. Dữ liệu được mã hóa, sao lưu định kỳ, và phân quyền theo vai trò.

**Q: Có thể làm việc offline không?**
> A: Hạn chế. Một số tính năng cần internet như thanh toán QR, tra cứu khách hàng.

### 8.2 Thực Hành Tốt Nhất

#### Để giao dịch nhanh hơn:
- ✅ Đánh dấu sản phẩm bán chạy làm Favorite
- ✅ Sử dụng máy quét barcode
- ✅ Học thuộc shortcut bàn phím
- ✅ Chuẩn bị phương thức thanh toán trước

#### Để đảm bảo chính xác:
- ✅ Đọc to danh sách sản phẩm cho khách
- ✅ Kiểm tra số lượng trước khi thanh toán
- ✅ Xác nhận chiết khấu đúng
- ✅ Đếm tiền thối cẩn thận

#### Để bảo mật:
- ✅ Không chia sẻ PIN
- ✅ Đăng xuất khi rời máy
- ✅ Báo cáo hoạt động đáng ngờ
- ✅ Thay đổi PIN định kỳ

#### Kết thúc ca:
- ✅ Đối chiếu tiền mặt với hệ thống
- ✅ Hoàn thành mọi giao dịch pending
- ✅ Lập báo cáo ca
- ✅ Đăng xuất an toàn

---

## 9. Phụ Lục

### 9.1 Phím Tắt

| Phím | Chức năng |
|------|-----------|
| `/` | Focus thanh tìm kiếm |
| `Enter` | Xác nhận/Áp dụng |
| `Esc` | Đóng popup/Hủy |
| `Tab` | Di chuyển giữa các trường |
| `F5` | Refresh trang |

### 9.2 Bảng Thuật Ngữ

| Thuật ngữ | Giải thích |
|-----------|------------|
| **POS** | Point of Sale - Điểm bán hàng |
| **SKU** | Stock Keeping Unit - Mã sản phẩm |
| **Subtotal** | Tạm tính trước thuế và chiết khấu |
| **Voucher** | Mã khuyến mãi |
| **Loyalty** | Chương trình khách hàng thân thiết |
| **Tier** | Hạng thành viên |
| **Draft** | Đơn hàng nháp |
| **Refund** | Hoàn tiền |
| **QR Code** | Mã thanh toán quét điện thoại |

### 9.3 Trạng Thái Đơn Hàng

| Trạng thái | Ý nghĩa |
|------------|---------|
| `draft` | Đơn nháp, chưa thanh toán |
| `pending` | Đang chờ xử lý |
| `completed` | Hoàn thành |
| `cancelled` | Đã hủy |
| `refunded` | Đã hoàn tiền |

### 9.4 Liên Hệ Hỗ Trợ Kỹ Thuật

```
📞 Hotline: 1900-XXXX (24/7)
📧 Email: support@fastpos.vn
💬 Chat: Trong ứng dụng
🌐 Website: https://fastpos.vn/help
📍 Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
```

---

> [!NOTE]
> Tài liệu này được cập nhật thường xuyên. Vui lòng kiểm tra phiên bản mới nhất tại website hỗ trợ.

---

**© 2025 Fast POS. All rights reserved.**

*Tài liệu này được tạo tự động từ mã nguồn ứng dụng.*
