;(function zwak() {
    var bounds = Array.prototype.map.call(document.body.getElementsByTagName('*'), function (element) {
        return { element: element, clientRect: element.getBoundingClientRect() };
    });
    var blind = document.createElement('div');
    document.body.appendChild(blind);
    blind.outerHTML = [
        '<div class="zwak-blind" style="' + [
                'position: absolute',
                'z-index: 1000000000',
                '-webkit-user-select: none',
                '-moz-user-select: none',
                '-ms-user-select: none',
                'user-select: none',
                'cursor: pointer',
                'top: ' + window.pageYOffset + 'px',
                'left: ' + window.pageXOffset + 'px',
                'width: ' + window.innerWidth + 'px',
                'height: ' + window.innerHeight + 'px',
                'background-color: black',
                'opacity: 0.5',
                'color: white',
                'font-family: sans-serif',
                'font-size: 26px',
                'font-weight: bold'
            ].join(';') + '">',
            '폭을 조절하고 싶은 곳이 어딘지 드래그해서 알려주세요.',
        '</div>'
    ].join('');
    blind = document.getElementsByClassName('zwak-blind')[0];
    var selectLine = document.createElement('div'), resizeLine = document.createElement('div');
    resizeLine.style.position = selectLine.style.position = 'absolute';
    resizeLine.style.height = selectLine.style.height = '10px';
    selectLine.style.backgroundColor = '#abcdef';
    resizeLine.style.backgroundColor = '#eeaabb';
    document.body.appendChild(selectLine);
    document.body.appendChild(resizeLine);
    var anchorX, anchorY;
    function firstdown(e) {
        anchorX = e.pageX;
        anchorY = e.pageY;
        selectLine.style.zIndex = 1000000001;
        selectLine.style.width = 0;
        selectLine.style.top = (anchorY - 5) + 'px';
        selectLine.style.left = anchorX + 'px';
        window.addEventListener('mousemove', firstmove);
        window.addEventListener('mouseup', firstup);
    }
    function firstmove(e) {
        var left = Math.min(e.pageX, anchorX);
        var right = Math.max(e.pageX, anchorX);
        var width = right - left;
        selectLine.style.left = left + 'px';
        selectLine.style.width = width + 'px';
    }
    function firstup(e) {
        window.removeEventListener('mousedown', firstdown);
        window.removeEventListener('mousemove', firstmove);
        window.removeEventListener('mouseup', firstup);
        second();
    }
    window.addEventListener('mousedown', firstdown);
    var target;
    function second() {
        var threshold = 100;
        var selectA = parseFloat(selectLine.style.left);
        var selectB = selectA + parseFloat(selectLine.style.width);
        var selectLeft = Math.min(selectA, selectB);
        var selectRight = Math.max(selectA, selectB);
        bounds.forEach(function (bound) {
            var boundLeft = bound.clientRect.left + window.pageXOffset;
            var boundRight = bound.clientRect.right + window.pageXOffset;
            bound.diff = Math.abs(boundLeft - selectLeft) + Math.abs(boundRight - selectRight);
        });
        bounds = bounds.filter(function (bound) {
            var boundTop = bound.clientRect.top + window.pageYOffset;
            var boundBottom = bound.clientRect.bottom + window.pageYOffset;
            return (anchorY > boundTop) && (anchorY < boundBottom) && (bound.diff < threshold);
        }).sort(function (a, b) {
            var aHeight = a.clientRect.height;
            var bHeight = b.clientRect.height;
            return aHeight > bHeight ? 1 : -1;
        });
        target = bounds.pop();
        if (target === undefined) {
            alert('문서에서 해당하는 폭을 가진 요소를 찾아내지 못했습니다. 다시 시도해주세요.');
            teardown();
            return;
        }
        selectLine.style.top = (target.clientRect.top + window.pageYOffset) + 'px';
        selectLine.style.left = (target.clientRect.left + window.pageXOffset) + 'px';
        selectLine.style.width = target.clientRect.width + 'px';
        selectLine.style.height = target.clientRect.height + 'px';
        selectLine.style.opacity = 0.3;
        blind.textContent = '어느정도의 폭으로 만들고 싶은지 드래그해서 알려주세요.';
        window.addEventListener('mousedown', seconddown);
    }
    function seconddown(e) {
        anchorX = e.pageX;
        anchorY = e.pageY;
        resizeLine.style.zIndex = 1000000001;
        resizeLine.style.width = 0;
        resizeLine.style.top = (anchorY - 5) + 'px';
        resizeLine.style.left = anchorX + 'px';
        window.addEventListener('mousemove', secondmove);
        window.addEventListener('mouseup', secondup);
    }
    function secondmove(e) {
        var left = Math.min(e.pageX, anchorX);
        var right = Math.max(e.pageX, anchorX);
        var width = right - left;
        resizeLine.style.left = left + 'px';
        resizeLine.style.width = width + 'px';
        target.element.style.width = width + 'px';
        target.element.style.minWidth = width + 'px';
        target.element.style.maxWidth = width + 'px';
    }
    function secondup(e) {
        window.removeEventListener('mousedown', seconddown);
        window.removeEventListener('mousemove', secondmove);
        window.removeEventListener('mouseup', secondup);
        teardown();
    }
    function teardown() {
        document.body.removeChild(blind);
        document.body.removeChild(selectLine);
        document.body.removeChild(resizeLine);
    }
})();
