// UI管理类
class UIManager {
    // 初始化事件监听器
    static init() {
        // 自动上传功能
        const autoUploadCheckbox = document.getElementById('autoUpload');
        if (autoUploadCheckbox) {
            autoUploadCheckbox.addEventListener('change', () => {
                const currentAutoUpload = autoUploadCheckbox.checked;
                localStorage.setItem('autoUpload', currentAutoUpload ? 'true' : 'false');
            });
            
            const savedAutoUpload = localStorage.getItem('autoUpload');
            autoUploadCheckbox.checked = savedAutoUpload === 'true';
        }
        
        // 自动选模功能
        const autoSelectCheckbox = document.getElementById('autoSelect');
        if (autoSelectCheckbox) {
            autoSelectCheckbox.addEventListener('change', () => {
                const currentAutoSelect = autoSelectCheckbox.checked;
                const modelSelect = document.getElementById('modelSelect');
                if (modelSelect) {
                    modelSelect.disabled = currentAutoSelect;
                }
                localStorage.setItem('autoSelect', currentAutoSelect ? 'true' : 'false');
            });
            
            const savedAutoSelect = localStorage.getItem('autoSelect');
            autoSelectCheckbox.checked = savedAutoSelect === 'true';
            const modelSelect = document.getElementById('modelSelect');
            if (modelSelect) {
                modelSelect.disabled = savedAutoSelect === 'true';
            }
        }
        
        // 提交按钮
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                if (typeof autoUpload === 'function') {
                    autoUpload();
                }
            });
        }
    }
    
    // 显示结果
    static displayResult(result) {
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.style.display = 'block';
            const resultHTML = `
                <p>请求ID: ${result.request_id}</p>
                <p>输出类型: ${result.output_type}</p>
                <p>内容: ${result.output}</p>
                <p>模型: ${result.model}</p>
            `;
            resultDiv.innerHTML = resultHTML;
        }
    }
    
    // 显示错误
    static displayError(error) {
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `<p style="color: red;">错误: ${error.message || error}</p>`;
        }
    }
    
    // 显示加载状态
    static showLoading() {
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<p>正在加载...</p>';
        }
    }
    
    // 清除结果
    static clearResult() {
        const resultDiv = document.getElementById('result');
        if (resultDiv) {
            resultDiv.style.display = 'none';
            resultDiv.innerHTML = '';
        }
    }
    
    // 获取选中的模型
    static getSelectedModel() {
        const autoSelect = document.getElementById('autoSelect');
        if (autoSelect && autoSelect.checked) {
            return 'auto';
        }
        
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            return modelSelect.value;
        }
        
        return null;
    }
    
    // 获取用户输入的提示
    static getPrompt() {
        const promptInput = document.getElementById('prompt');
        if (promptInput) {
            return promptInput.value;
        }
        
        return '';
    }
    
    // 获取选中的文件
    static getSelectedFiles() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            return Array.from(fileInput.files);
        }
        
        return [];
    }
}

// 导出UI管理类
export default UIManager;
