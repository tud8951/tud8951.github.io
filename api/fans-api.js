// 粉丝数据API服务
class FansAPI {
  constructor() {
    this.fansData = {
      bilibili: {
        uid: 'F3Lr8Pu',
        api: 'https://api.bilibili.com/x/relation/stat?vmid=',
        current: 27000
      },
      xiaohongshu: {
        userId: '64451ccf0000000014013283',
        current: 2679
      },
      douyin: {
        current: 1000
      },
      youtube: {
        channelId: '@CNBigJackson',
        current: 31
      }
    };
  }

  // 格式化粉丝数
  formatFansCount(count) {
    if (!count) return '0';
    
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + 'w';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }

  // 获取B站粉丝数
  async getBilibiliFans() {
    try {
      // 使用代理API避免跨域问题
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`${this.fansData.bilibili.api}${this.fansData.bilibili.uid}`)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data && data.contents) {
        const biliData = JSON.parse(data.contents);
        if (biliData && biliData.data) {
          return biliData.data.follower;
        }
      }
    } catch (error) {
      console.error('获取B站粉丝数失败:', error);
    }
    return this.fansData.bilibili.current;
  }

  // 获取所有平台粉丝数
  async getAllFans() {
    const bilibiliFans = await this.getBilibiliFans();
    
    return {
      bilibili: bilibiliFans,
      xiaohongshu: this.fansData.xiaohongshu.current,
      douyin: this.fansData.douyin.current,
      youtube: this.fansData.youtube.current
    };
  }

  // 更新页面显示
  updateFansDisplay(fans) {
    const fansText = `我在哔哩哔哩拥有${this.formatFansCount(fans.bilibili)}粉丝，小红书有${fans.xiaohongshu}粉丝，得物有780粉丝，抖音有${fans.douyin}粉丝，YouTube有${fans.youtube}个粉丝。`;
    
    // 查找包含粉丝信息的元素并更新
    const aboutContent = document.querySelector('.post-content');
    if (aboutContent) {
      const fansRegex = /我在哔哩哔哩拥有[\d\.]+w?粉丝，小红书有\d+粉丝，得物有\d+粉丝，抖音有\d+粉丝，YouTube有\d+个粉丝。/;
      aboutContent.innerHTML = aboutContent.innerHTML.replace(fansRegex, fansText);
    }
  }

  // 添加刷新按钮
  addRefreshButton() {
    const aboutContent = document.querySelector('.post-content');
    if (aboutContent && !document.getElementById('fans-refresh-btn')) {
      const refreshBtn = document.createElement('button');
      refreshBtn.id = 'fans-refresh-btn';
      refreshBtn.textContent = '🔄 刷新粉丝数';
      refreshBtn.style.cssText = `
        background: linear-gradient(45deg, #007bff, #0056b3);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        margin: 15px 0;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0,123,255,0.3);
        transition: all 0.3s ease;
      `;
      
      refreshBtn.addEventListener('mouseover', () => {
        refreshBtn.style.transform = 'translateY(-2px)';
        refreshBtn.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)';
      });
      
      refreshBtn.addEventListener('mouseout', () => {
        refreshBtn.style.transform = 'translateY(0)';
        refreshBtn.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)';
      });
      
      refreshBtn.addEventListener('click', async () => {
        refreshBtn.textContent = '🔄 更新中...';
        refreshBtn.disabled = true;
        refreshBtn.style.background = '#6c757d';
        
        try {
          const fans = await this.getAllFans();
          this.updateFansDisplay(fans);
          refreshBtn.textContent = '✅ 已更新';
          refreshBtn.style.background = '#28a745';
          
          setTimeout(() => {
            refreshBtn.textContent = '🔄 刷新粉丝数';
            refreshBtn.disabled = false;
            refreshBtn.style.background = 'linear-gradient(45deg, #007bff, #0056b3)';
          }, 2000);
        } catch (error) {
          refreshBtn.textContent = '❌ 更新失败';
          refreshBtn.style.background = '#dc3545';
          
          setTimeout(() => {
            refreshBtn.textContent = '🔄 刷新粉丝数';
            refreshBtn.disabled = false;
            refreshBtn.style.background = 'linear-gradient(45deg, #007bff, #0056b3)';
          }, 2000);
        }
      });
      
      aboutContent.appendChild(refreshBtn);
    }
  }

  // 初始化
  async init() {
    try {
      const fans = await this.getAllFans();
      this.updateFansDisplay(fans);
      this.addRefreshButton();
      
      // 添加粉丝数显示样式
      this.addFansStyle();
    } catch (error) {
      console.error('初始化粉丝数据失败:', error);
    }
  }

  // 添加样式
  addFansStyle() {
    if (!document.getElementById('fans-style')) {
      const style = document.createElement('style');
      style.id = 'fans-style';
      style.textContent = `
        .fans-counter {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .fans-counter h3 {
          margin: 0 0 15px 0;
          font-size: 18px;
          text-align: center;
        }
        
        .fans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .fans-item {
          text-align: center;
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        
        .fans-count {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .fans-platform {
          font-size: 12px;
          opacity: 0.8;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// 创建API实例并初始化
const fansAPI = new FansAPI();

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => fansAPI.init());
} else {
  fansAPI.init();
} 