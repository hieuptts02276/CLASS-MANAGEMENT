(function(){
  function initAutoSave(){
    const forms = document.querySelectorAll('form[data-storage-key]');
    forms.forEach(form => {
      const key = form.dataset.storageKey;
      try {
        const saved = localStorage.getItem(key);
        if(saved){
          const data = JSON.parse(saved);
          Object.entries(data).forEach(([name, value]) => {
            const field = form.elements.namedItem(name);
            if(!field) return;
            if(field.type === 'checkbox' || field.type === 'radio') field.checked = !!value;
            else field.value = value;
          });
        }
      } catch(err){ console.warn('Không thể đọc dữ liệu localStorage', err); }

      const persist = () => {
        const data = {};
        Array.from(form.elements).forEach(el => {
          if(!el.name) return;
          if(el.type === 'checkbox' || el.type === 'radio') data[el.name] = el.checked;
          else data[el.name] = el.value;
        });
        localStorage.setItem(key, JSON.stringify(data));
      };

      form.addEventListener('input', persist);
      form.addEventListener('change', persist);

      const saveBtn = form.querySelector('[data-action="save"]');
      const clearBtn = form.querySelector('[data-action="clear"]');
      if(saveBtn){
        saveBtn.addEventListener('click', (e)=>{
          e.preventDefault();
          persist();
          alert('Đã sao lưu dữ liệu vào localStorage.');
        });
      }
      if(clearBtn){
        clearBtn.addEventListener('click', (e)=>{
          e.preventDefault();
          localStorage.removeItem(key);
          form.reset();
          alert('Đã xóa dữ liệu localStorage của trang này.');
        });
      }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAutoSave);
  else initAutoSave();
})();
