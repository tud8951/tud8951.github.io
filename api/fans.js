// 粉丝数据API接口
const fansData = {
  bilibili: {
    uid: '1549550569',
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

// 格式化粉丝数
function formatFansCount(count) {
  if (!count) return '0';
  
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

// 获取B站粉丝数
async function getBilibiliFans() {
  try {
    const response = await fetch(`${fansData.bilibili.api}${fansData.bilibili.uid}`);
    const data = await response.json();
    if (data && data.data) {
      return data.data.follower;
    }
  } catch (error) {
    console.error('获取B站粉丝数失败:', error);
  }
  return fansData.bilibili.current;
}

// 获取所有平台粉丝数
async function getAllFans() {
  const bilibiliFans = await getBilibiliFans();
  
  return {
    bilibili: bilibiliFans,
    xiaohongshu: fansData.xiaohongshu.current,
    douyin: fansData.douyin.current,
    youtube: fansData.youtube.current
  };
}

// 更新页面显示
function updateFansDisplay(fans) {
  const fansText = `我在哔哩哔哩拥有${formatFansCount(fans.bilibili)}粉丝，小红书有${fans.xiaohongshu}粉丝，得物有780粉丝，抖音有${fans.douyin}粉丝，YouTube有${fans.youtube}个粉丝。`;
  
  // 查找包含粉丝信息的元素并更新
  const aboutContent = document.querySelector('.post-content');
  if (aboutContent) {
    const fansRegex = /我在哔哩哔哩拥有[\d\.]+w?粉丝，小红书有\d+粉丝，得物有\d+粉丝，抖音有\d+粉丝，YouTube有\d+个粉丝。/;
    aboutContent.innerHTML = aboutContent.innerHTML.replace(fansRegex, fansText);
  }
}

// 初始化粉丝数据
async function initFansData() {
  try {
    const fans = await getAllFans();
    updateFansDisplay(fans);
    
    // 添加刷新按钮
    addRefreshButton();
  } catch (error) {
    console.error('初始化粉丝数据失败:', error);
  }
}

// 添加刷新按钮
function addRefreshButton() {
  const aboutContent = document.querySelector('.post-content');
  if (aboutContent) {
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 刷新粉丝数';
    refreshBtn.style.cssText = `
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin: 10px 0;
      font-size: 14px;
    `;
    
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '🔄 更新中...';
      refreshBtn.disabled = true;
      
      try {
        const fans = await getAllFans();
        updateFansDisplay(fans);
        refreshBtn.textContent = '✅ 已更新';
        setTimeout(() => {
          refreshBtn.textContent = '🔄 刷新粉丝数';
          refreshBtn.disabled = false;
        }, 2000);
      } catch (error) {
        refreshBtn.textContent = '❌ 更新失败';
        setTimeout(() => {
          refreshBtn.textContent = '🔄 刷新粉丝数';
          refreshBtn.disabled = false;
        }, 2000);
      }
    });
    
    aboutContent.appendChild(refreshBtn);
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFansData);
} else {
  initFansData();
} 