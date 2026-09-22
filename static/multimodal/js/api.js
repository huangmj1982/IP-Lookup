// API配置
const API_BASE_URL = 'http://127.0.0.1:8091';

// API服务类
class APIService {
    // 上传文件
    static async uploadFiles(files) {
        if (files.length === 0) {
            return [];
        }
        
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }
        
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('文件上传失败');
        }
        
        const data = await response.json();
        return data.files;
    }
    
    // 调用模型
    static async callModel(model, text, files) {
        const response = await fetch(`${API_BASE_URL}/infer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                text: text,
                files: files
            })
        });
        
        if (!response.ok) {
            throw new Error('模型调用失败');
        }
        
        return await response.json();
    }
}

// 导出API服务
export default APIService;
