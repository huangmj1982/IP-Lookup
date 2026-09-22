import APIService from './api.js';

// 业务逻辑类
class AppLogic {
    // 自动选择模型
    static autoSelectModel(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        if (lowerPrompt.includes('图片') || lowerPrompt.includes('生成图') || lowerPrompt.includes('画')) {
            return 'doubao-seedream-4-5-251128';
        } else if (lowerPrompt.includes('视频') || lowerPrompt.includes('生成视频') || lowerPrompt.includes('视频生成')) {
            return 'doubao-seedance-1-0-pro-250528';
        } else {
            return 'doubao-seed-1-6-251015';
        }
    }
    
    // 提交请求
    static async submitRequest(prompt, model, files, onResult, onError) {
        try {
            // 验证输入
            if (!prompt.trim()) {
                throw new Error('请输入对话内容');
            }
            
            // 上传文件
            let uploadedFiles = [];
            if (files.length > 0) {
                uploadedFiles = await APIService.uploadFiles(files);
            }
            
            // 调用模型
            const result = await APIService.callModel(model, prompt, uploadedFiles);
            
            // 处理结果
            onResult(result);
        } catch (error) {
            onError(error);
        }
    }
}

// 导出业务逻辑类
export default AppLogic;
