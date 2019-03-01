{% if theme.valine.enable and theme.valine.appid and theme.valine.appkey %}
  <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
  {% set valine_uri = '//unpkg.com/valine/dist/Valine.min.js' %}
  {% if theme.vendors.valine %}
    {% set valine_uri = theme.vendors.valine %}
  {% endif %}
  <script src="{{ valine_uri }}"></script>

  <script>
    var GUEST = ['nick','mail','link'];
    var guest = '{{ theme.valine.guest_info }}';
    guest = guest.split(',').filter(function (item) {
      return GUEST.indexOf(item)>-1;
    });
    new Valine({
        el: '#comments' ,
        verify: {{ theme.valine.verify }},
        notify: {{ theme.valine.notify }},
        appId: '{{ theme.valine.appid }}',
        appKey: '{{ theme.valine.appkey }}',
        placeholder: '{{ theme.valine.placeholder }}',
        avatar:'{{ theme.valine.avatar }}',
        meta:guest,
        pageSize:'{{ theme.valine.pageSize }}' || 10,
        visitor: {{ theme.valine.visitor }},
        avatar_cdn:'{{ theme.valine.avatar_cdn }}'
    });
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('vsubmit')) {
            const email = document.querySelector('input[type=email]');
            const nick = document.querySelector('input[name=nick]');
            if (!email.value || !nick.value) {
                const str = `<div class="valert txt-center"><div class="vtext">请填写昵称和邮箱！</div></div>`;
                const vmark = document.querySelector('.vmark');
                vmark.innerHTML = str;
                vmark.style.display = 'block';
                setTimeout(function() {
                    vmark.style.display = 'none';
                    vmark.innerHTML = '';
                }, 2500);
            }
        }
    });
  </script>
{% endif %}
