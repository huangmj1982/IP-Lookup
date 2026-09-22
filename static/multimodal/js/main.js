import AppLogic from './logic.js';
import UIManager from './ui.js';

// 主应用类
class App {
    // 初始化应用
    static init() {
        // 初始化UI管理
        UIManager.init();
        
        // 绑定事件
        App.bindEvents();
    }
    
    // 绑定事件
    static bindEvents() {
        // 提交按钮点击事件
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                App.handleSubmit();
            });
        }
        
        // 输入框输入事件（用于自动选模）
        const promptInput = document.getElementById('prompt');
        if (promptInput) {
            promptInput.addEventListener('input', () => {
                App.handleInputChange();
            });
        }
    }
    
    // 处理提交
    static async handleSubmit() {
        // 清除之前的结果
        UIManager.clearResult();
        
        // 显示加载状态
        UIManager.showLoading();
        
        // 获取输入
        const prompt = UIManager.getPrompt();
        const model = UIManager.getSelectedModel();
        const files = UIManager.getSelectedFiles();
        
        // 处理自动选模
        let selectedModel = model;
        if (model === 'auto') {
            selectedModel = AppLogic.autoSelectModel(prompt);
        }
        
        // 提交请求
        await AppLogic.submitRequest(
            prompt,
            selectedModel,
            files,
            (result) => {
                UIManager.displayResult(result);
            },
            (error) => {
                UIManager.displayError(error);
            }
        );
    }
    
    // 处理输入变化
    static handleInputChange() {
        const autoSelect = document.getElementById('autoSelect');
        if (autoSelect && autoSelect.checked) {
            // 如果启用了自动选模，显示当前选择的模型
            const prompt = UIManager.getPrompt();
            const selectedModel = AppLogic.autoSelectModel(prompt);
            console.log('自动选择的模型:', selectedModel);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
