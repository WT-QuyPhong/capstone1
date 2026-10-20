# capstone1

Repository cho dự án Capstone của WT-QuyPhong.

## Giao việc cho AI trên GitHub

Workflow [Codex coding task](https://github.com/WT-QuyPhong/capstone1/actions/workflows/codex-task.yml) nhận yêu cầu, sửa code và đẩy kết quả lên nhánh mới `codex/task-<run-id>-<attempt>`. Workflow tạo pull request dạng draft nếu GitHub cho phép. Mỗi lượt bắt đầu từ một commit xác định; workflow không tự merge kết quả.

### Thiết lập một lần

1. Tạo OpenAI API key trong [OpenAI Platform](https://platform.openai.com/api-keys).
2. Vào [Settings → Secrets and variables → Actions](https://github.com/WT-QuyPhong/capstone1/settings/secrets/actions), chọn **New repository secret**. Đặt tên `OPENAI_API_KEY` và dán khóa vào phần Secret. Không gửi khóa trong chat, Issue hay code.
3. Để AI tự mở pull request, vào [Settings → Actions → General](https://github.com/WT-QuyPhong/capstone1/settings/actions), bật **Allow GitHub Actions to create and approve pull requests**. Nếu tùy chọn này bị tắt, workflow vẫn đẩy code lên nhánh và cung cấp liên kết trong trang kết quả.

Workflow dùng OpenAI API; cần tài khoản API có quyền sử dụng và hạn mức phù hợp. Kết nối GitHub của cuộc chat và khóa API dùng trên runner là hai phần riêng.

### Cách 1: Gửi yêu cầu bằng Issue

Tạo hoặc mở một [GitHub Issue](https://github.com/WT-QuyPhong/capstone1/issues), rồi dùng tài khoản `WT-QuyPhong` đăng **comment mới** như sau:

```text
/codex Tạo trang đăng nhập responsive, thêm kiểm tra email và mật khẩu.
```

Lệnh phải bắt đầu bằng `/codex `, theo sau là yêu cầu. Nội dung Issue không tự gửi cho AI; hãy viết đủ thông tin trong comment. Workflow nhận comment trên Issue, không nhận comment trên pull request. Comment của tài khoản khác sẽ không chạy AI.

Mỗi comment mới tạo một lượt chạy và một nhánh mới từ nhánh mặc định. Sửa comment cũ không chạy lại tác vụ.

### Cách 2: Run workflow

Mở [Codex coding task](https://github.com/WT-QuyPhong/capstone1/actions/workflows/codex-task.yml), chọn **Run workflow** trên `main`, nhập `task` và `base_branch`, rồi chạy. `base_branch` phải là nhánh đã tồn tại; mặc định là `main`.

Bạn cũng có thể yêu cầu cuộc chat có kết nối GitHub đăng comment `/codex ...` lên một Issue cụ thể để giao việc cho workflow.

### Xem kết quả

Mở [Actions](https://github.com/WT-QuyPhong/capstone1/actions) → lượt chạy → **Summary** để xem liên kết nhánh và pull request. Artifact `codex-result-...` chứa patch và báo cáo của AI, được giữ 7 ngày. Nếu AI không thay đổi file nào, workflow chỉ lưu báo cáo.

Repo mới được khởi tạo với README và cấu hình tự động hóa. Muốn AI sửa ứng dụng hiện có, cần đưa mã nguồn ứng dụng lên repo trước, hoặc giao yêu cầu khởi tạo dự án mới.

Workflow tách bước AI có quyền đọc GitHub khỏi bước đẩy code có quyền ghi. Job đẩy code không thực thi script sinh bởi AI. Các thay đổi trong `.github/`, `.git/` và file `.env` thực bị chặn; mẫu `.env.example`, `.env.sample`, `.env.template` được phép. Các tác vụ chỉnh workflow hoặc cấu hình bí mật cần thực hiện riêng trong cuộc chat.

Tài liệu: [Codex GitHub Action](https://learn.chatgpt.com/docs/github-action).
