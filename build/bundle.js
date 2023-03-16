
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.56.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const selectedNavItem = writable('blog');

    /* src\Navbar.svelte generated by Svelte v3.56.0 */
    const file$9 = "src\\Navbar.svelte";

    // (19:16) {:else}
    function create_else_block$4(ctx) {
    	let span0;
    	let span1;
    	let span2;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			span0.textContent = "•";
    			span1 = element("span");
    			span1.textContent = "••";
    			span2 = element("span");
    			span2.textContent = "•";
    			attr_dev(span0, "class", "one");
    			add_location(span0, file$9, 19, 20, 818);
    			attr_dev(span1, "class", "two");
    			add_location(span1, file$9, 19, 46, 844);
    			attr_dev(span2, "class", "three");
    			add_location(span2, file$9, 19, 73, 871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, span2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(span2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(19:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:16) {#if ip}
    function create_if_block$5(ctx) {
    	let small;
    	let small_transition;
    	let current;

    	const block = {
    		c: function create() {
    			small = element("small");
    			small.textContent = `${/*ip*/ ctx[1]}`;
    			add_location(small, file$9, 17, 20, 736);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!small_transition) small_transition = create_bidirectional_transition(small, fade, {}, true);
    				small_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!small_transition) small_transition = create_bidirectional_transition(small, fade, {}, false);
    			small_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    			if (detaching && small_transition) small_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(17:16) {#if ip}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let nav;
    	let div4;
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let div0;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let t3;
    	let button0;
    	let svg0;
    	let g0;
    	let g1;
    	let g2;
    	let title;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let t4;
    	let div3;
    	let ul0;
    	let li0;
    	let span0;
    	let t6;
    	let li1;
    	let span1;
    	let t8;
    	let li2;
    	let span2;
    	let t10;
    	let li3;
    	let span3;
    	let t12;
    	let li4;
    	let a0;
    	let t14;
    	let li5;
    	let span4;
    	let svg1;
    	let g3;
    	let g4;
    	let g5;
    	let path4;
    	let t15;
    	let li6;
    	let span5;
    	let svg2;
    	let g6;
    	let g7;
    	let g8;
    	let path5;
    	let t16;
    	let div8;
    	let div6;
    	let div5;
    	let svg3;
    	let g9;
    	let g10;
    	let g12;
    	let g11;
    	let rect0;
    	let rect1;
    	let rect2;
    	let rect3;
    	let t17;
    	let button1;
    	let svg4;
    	let g13;
    	let g14;
    	let g15;
    	let path6;
    	let t18;
    	let div7;
    	let ul1;
    	let li7;
    	let span7;
    	let svg5;
    	let g16;
    	let g17;
    	let path7;
    	let g18;
    	let path8;
    	let t19;
    	let span6;
    	let t21;
    	let li8;
    	let span9;
    	let svg6;
    	let g19;
    	let g20;
    	let g21;
    	let path9;
    	let t22;
    	let span8;
    	let t24;
    	let li9;
    	let span11;
    	let svg7;
    	let g22;
    	let g23;
    	let g24;
    	let path10;
    	let t25;
    	let span10;
    	let t27;
    	let li10;
    	let span13;
    	let svg8;
    	let g25;
    	let g26;
    	let g27;
    	let path11;
    	let t28;
    	let span12;
    	let t30;
    	let li11;
    	let span15;
    	let svg9;
    	let g28;
    	let g29;
    	let g30;
    	let path12;
    	let t31;
    	let span14;
    	let t33;
    	let li12;
    	let span17;
    	let svg10;
    	let g31;
    	let g32;
    	let g33;
    	let path13;
    	let t34;
    	let span16;
    	let t36;
    	let li13;
    	let a1;
    	let svg11;
    	let g34;
    	let g35;
    	let g36;
    	let path14;
    	let t37;
    	let span18;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$5, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*ip*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div4 = element("div");
    			div2 = element("div");
    			img = element("img");
    			t0 = text("  \r\n            ");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Suyash Jawale";
    			t2 = space();
    			if_block.c();
    			t3 = space();
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			title = svg_element("title");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			t4 = space();
    			div3 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			span0 = element("span");
    			span0.textContent = "Home";
    			t6 = space();
    			li1 = element("li");
    			span1 = element("span");
    			span1.textContent = "Projects";
    			t8 = space();
    			li2 = element("li");
    			span2 = element("span");
    			span2.textContent = "Skills";
    			t10 = space();
    			li3 = element("li");
    			span3 = element("span");
    			span3.textContent = "Blog";
    			t12 = space();
    			li4 = element("li");
    			a0 = element("a");
    			a0.textContent = "Resume";
    			t14 = space();
    			li5 = element("li");
    			span4 = element("span");
    			svg1 = svg_element("svg");
    			g3 = svg_element("g");
    			g4 = svg_element("g");
    			g5 = svg_element("g");
    			path4 = svg_element("path");
    			t15 = space();
    			li6 = element("li");
    			span5 = element("span");
    			svg2 = svg_element("svg");
    			g6 = svg_element("g");
    			g7 = svg_element("g");
    			g8 = svg_element("g");
    			path5 = svg_element("path");
    			t16 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			svg3 = svg_element("svg");
    			g9 = svg_element("g");
    			g10 = svg_element("g");
    			g12 = svg_element("g");
    			g11 = svg_element("g");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			rect3 = svg_element("rect");
    			t17 = space();
    			button1 = element("button");
    			svg4 = svg_element("svg");
    			g13 = svg_element("g");
    			g14 = svg_element("g");
    			g15 = svg_element("g");
    			path6 = svg_element("path");
    			t18 = space();
    			div7 = element("div");
    			ul1 = element("ul");
    			li7 = element("li");
    			span7 = element("span");
    			svg5 = svg_element("svg");
    			g16 = svg_element("g");
    			g17 = svg_element("g");
    			path7 = svg_element("path");
    			g18 = svg_element("g");
    			path8 = svg_element("path");
    			t19 = text("\r\n                    ");
    			span6 = element("span");
    			span6.textContent = "Home";
    			t21 = space();
    			li8 = element("li");
    			span9 = element("span");
    			svg6 = svg_element("svg");
    			g19 = svg_element("g");
    			g20 = svg_element("g");
    			g21 = svg_element("g");
    			path9 = svg_element("path");
    			t22 = text("\r\n                    ");
    			span8 = element("span");
    			span8.textContent = "Projects";
    			t24 = space();
    			li9 = element("li");
    			span11 = element("span");
    			svg7 = svg_element("svg");
    			g22 = svg_element("g");
    			g23 = svg_element("g");
    			g24 = svg_element("g");
    			path10 = svg_element("path");
    			t25 = text("\r\n                    ");
    			span10 = element("span");
    			span10.textContent = "Skills";
    			t27 = space();
    			li10 = element("li");
    			span13 = element("span");
    			svg8 = svg_element("svg");
    			g25 = svg_element("g");
    			g26 = svg_element("g");
    			g27 = svg_element("g");
    			path11 = svg_element("path");
    			t28 = text("\r\n                    ");
    			span12 = element("span");
    			span12.textContent = "Blog";
    			t30 = space();
    			li11 = element("li");
    			span15 = element("span");
    			svg9 = svg_element("svg");
    			g28 = svg_element("g");
    			g29 = svg_element("g");
    			g30 = svg_element("g");
    			path12 = svg_element("path");
    			t31 = text("\r\n                    ");
    			span14 = element("span");
    			span14.textContent = "Snippets";
    			t33 = space();
    			li12 = element("li");
    			span17 = element("span");
    			svg10 = svg_element("svg");
    			g31 = svg_element("g");
    			g32 = svg_element("g");
    			g33 = svg_element("g");
    			path13 = svg_element("path");
    			t34 = text("\r\n                    ");
    			span16 = element("span");
    			span16.textContent = "Collections";
    			t36 = space();
    			li13 = element("li");
    			a1 = element("a");
    			svg11 = svg_element("svg");
    			g34 = svg_element("g");
    			g35 = svg_element("g");
    			g36 = svg_element("g");
    			path14 = svg_element("path");
    			t37 = text("\r\n                     ");
    			span18 = element("span");
    			span18.textContent = "Resume";
    			attr_dev(img, "class", "rounded-circle px-0");
    			if (!src_url_equal(img.src, img_src_value = "assets/images/suyash.44093981.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "44");
    			attr_dev(img, "height", "44");
    			attr_dev(img, "alt", "profile");
    			add_location(img, file$9, 13, 12, 484);
    			attr_dev(div0, "class", "font-weight-500");
    			add_location(div0, file$9, 15, 16, 640);
    			add_location(div1, file$9, 14, 12, 617);
    			attr_dev(div2, "class", "btn-group btn-group-sm btn-padding px-0 text-light");
    			attr_dev(div2, "role", "group");
    			attr_dev(div2, "aria-label", "Basic example");
    			add_location(div2, file$9, 12, 8, 366);
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$9, 25, 152, 1315);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$9, 25, 200, 1363);
    			add_location(title, file$9, 25, 311, 1474);
    			attr_dev(path0, "d", "M21.86,18.73H9.18a2,2,0,0,1,0-4H21.86a2,2,0,0,1,0,4Z");
    			add_location(path0, file$9, 25, 327, 1490);
    			attr_dev(path1, "d", "M54.82,18.73H34.88a2,2,0,0,1,0-4H54.82a2,2,0,0,1,0,4Z");
    			add_location(path1, file$9, 25, 398, 1561);
    			attr_dev(path2, "d", "M54.82,34H9.18a2,2,0,0,1,0-4H54.82a2,2,0,0,1,0,4Z");
    			add_location(path2, file$9, 25, 470, 1633);
    			attr_dev(path3, "d", "M54.82,49.27H30.07a2,2,0,0,1,0-4H54.82a2,2,0,0,1,0,4Z");
    			add_location(path3, file$9, 25, 538, 1701);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$9, 25, 282, 1445);
    			attr_dev(svg0, "fill", "#ffffff");
    			attr_dev(svg0, "width", "1.9rem");
    			attr_dev(svg0, "height", "1.9rem");
    			attr_dev(svg0, "viewBox", "0 0 64 64");
    			attr_dev(svg0, "data-name", "Layer 1");
    			attr_dev(svg0, "id", "Layer_1");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$9, 25, 12, 1175);
    			attr_dev(button0, "class", "btn navbar-toggler bg-transparent border-0 px-0 shadow-none");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-bs-toggle", "offcanvas");
    			attr_dev(button0, "data-bs-target", "#offcanvasNavbar");
    			attr_dev(button0, "aria-controls", "offcanvasNavbar");
    			add_location(button0, file$9, 24, 8, 978);
    			attr_dev(span0, "class", "nav-link");
    			toggle_class(span0, "active", /*$selectedNavItem*/ ctx[0] === 'home');
    			add_location(span0, file$9, 32, 20, 2109);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$9, 31, 16, 2022);
    			attr_dev(span1, "class", "nav-link");
    			toggle_class(span1, "active", /*$selectedNavItem*/ ctx[0] === 'projects');
    			add_location(span1, file$9, 37, 20, 2410);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$9, 36, 16, 2319);
    			attr_dev(span2, "class", "nav-link");
    			toggle_class(span2, "active", /*$selectedNavItem*/ ctx[0] === 'skills');
    			add_location(span2, file$9, 42, 20, 2717);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$9, 41, 16, 2628);
    			attr_dev(span3, "class", "nav-link");
    			toggle_class(span3, "active", /*$selectedNavItem*/ ctx[0] === 'blog');
    			add_location(span3, file$9, 47, 20, 3018);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file$9, 46, 16, 2931);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "assets/files/Suyash_Jawale_Resume.pdf");
    			attr_dev(a0, "download", "");
    			add_location(a0, file$9, 51, 20, 3197);
    			attr_dev(li4, "class", "nav-item");
    			add_location(li4, file$9, 50, 16, 3154);
    			attr_dev(g3, "id", "SVGRepo_bgCarrier");
    			attr_dev(g3, "stroke-width", "0");
    			add_location(g3, file$9, 57, 151, 3704);
    			attr_dev(g4, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g4, "stroke-linecap", "round");
    			attr_dev(g4, "stroke-linejoin", "round");
    			add_location(g4, file$9, 57, 198, 3751);
    			attr_dev(path4, "d", "M112.941 451.765h338.824V112.94H112.94v338.824zM508.235 0H56.471C25.299 0 0 25.299 0 56.47v451.765c0 31.172 25.299 56.47 56.47 56.47h451.765c31.172 0 56.47-25.298 56.47-56.47V56.471C564.706 25.299 539.408 0 508.236 0zm282.353 451.765h338.824V112.94H790.588v338.824zM1185.882 0H734.118c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.47 56.47 56.47h451.764c31.172 0 56.47-25.298 56.47-56.47V56.471c0-31.172-25.298-56.471-56.47-56.471zm282.353 451.765h338.824V112.94h-338.824v338.824zM1863.53 0h-451.764c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.47 56.47 56.47h451.764c31.172 0 56.471-25.298 56.471-56.47V56.471C1920 25.299 1894.701 0 1863.53 0zM112.941 1129.412h338.824V790.588H112.94v338.824zm395.294-451.765H56.471C25.299 677.647 0 702.946 0 734.117v451.765c0 31.172 25.299 56.47 56.47 56.47h451.765c31.172 0 56.47-25.298 56.47-56.47V734.118c0-31.172-25.298-56.47-56.47-56.47zm282.353 451.765h338.824V790.588H790.588v338.824zm395.294-451.765H734.118c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.47 56.47 56.47h451.764c31.172 0 56.47-25.298 56.47-56.47V734.118c0-31.172-25.298-56.47-56.47-56.47zm282.353 451.765h338.824V790.588h-338.824v338.824zm395.294-451.765h-451.764c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.47 56.47 56.47h451.764c31.172 0 56.471-25.298 56.471-56.47V734.118c0-31.172-25.299-56.47-56.47-56.47zM112.941 1807.06h338.824v-338.824H112.94v338.824zm395.294-451.765H56.471c-31.172 0-56.471 25.299-56.471 56.47v451.765c0 31.171 25.299 56.47 56.47 56.47h451.765c31.172 0 56.47-25.299 56.47-56.47v-451.765c0-31.172-25.298-56.47-56.47-56.47zm282.353 451.765h338.824v-338.824H790.588v338.824zm395.294-451.765H734.118c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.471 56.47 56.471h451.764c31.172 0 56.47-25.299 56.47-56.47v-451.765c0-31.172-25.298-56.47-56.47-56.47zm282.353 451.765h338.824v-338.824h-338.824v338.824zm395.294-451.765h-451.764c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.471 56.47 56.471h451.764c31.172 0 56.471-25.299 56.471-56.47v-451.765c0-31.172-25.299-56.47-56.47-56.47z");
    			attr_dev(path4, "fill-rule", "evenodd");
    			add_location(path4, file$9, 57, 308, 3861);
    			attr_dev(g5, "id", "SVGRepo_iconCarrier");
    			add_location(g5, file$9, 57, 279, 3832);
    			attr_dev(svg1, "fill", "#ffffff");
    			attr_dev(svg1, "width", "1.2rem");
    			attr_dev(svg1, "height", "1.2rem");
    			attr_dev(svg1, "viewBox", "0 0 1920 1920");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "stroke", "#ffffff");
    			add_location(svg1, file$9, 57, 24, 3577);
    			attr_dev(span4, "class", "nav-link");
    			attr_dev(span4, "title", "collections");
    			add_location(span4, file$9, 56, 20, 3508);
    			attr_dev(li5, "class", "nav-item");
    			add_location(li5, file$9, 55, 16, 3414);
    			attr_dev(g6, "id", "SVGRepo_bgCarrier");
    			attr_dev(g6, "stroke-width", "0");
    			add_location(g6, file$9, 64, 133, 6442);
    			attr_dev(g7, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g7, "stroke-linecap", "round");
    			attr_dev(g7, "stroke-linejoin", "round");
    			attr_dev(g7, "stroke", "#CCCCCC");
    			attr_dev(g7, "stroke-width", "1.152");
    			add_location(g7, file$9, 64, 180, 6489);
    			attr_dev(path5, "fill-rule", "evenodd");
    			attr_dev(path5, "clip-rule", "evenodd");
    			attr_dev(path5, "d", "M11.372 0.189436C11.7526 -0.0631454 12.2474 -0.0631454 12.628 0.189436L23.4922 7.39931C23.8094 7.60977 24 7.96507 24 8.34568V15.6543C24 16.0349 23.8094 16.3902 23.4922 16.6007L12.628 23.8106C12.2474 24.0631 11.7526 24.0631 11.372 23.8106L0.507759 16.6007C0.190634 16.3902 0 16.0349 0 15.6543V8.34568C0 7.96507 0.190634 7.60977 0.507759 7.39931L11.372 0.189436ZM2.27161 10.4626V13.5213L4.56046 11.9816L2.27161 10.4626ZM6.60915 13.3411L3.1802 15.6479L10.8642 20.7473V16.165L6.60915 13.3411ZM13.1358 16.165V20.7473L20.8198 15.6479L17.3909 13.3411L13.1358 16.165ZM19.4395 11.9816L21.7284 13.5213V10.4626L19.4395 11.9816ZM20.8101 8.34568L17.3994 10.6091L13.1358 7.74087V3.25272L20.8101 8.34568ZM10.8642 3.25272V7.74087L6.60056 10.6091L3.18988 8.34568L10.8642 3.25272ZM12 9.71457L8.64925 11.9687L12 14.1924L15.3508 11.9687L12 9.71457Z");
    			attr_dev(path5, "fill", "#ffffff");
    			add_location(path5, file$9, 64, 328, 6637);
    			attr_dev(g8, "id", "SVGRepo_iconCarrier");
    			add_location(g8, file$9, 64, 299, 6608);
    			attr_dev(svg2, "width", "1.2rem");
    			attr_dev(svg2, "height", "1.2rem");
    			attr_dev(svg2, "viewBox", "0 0 24.00 24.00");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg2, file$9, 64, 24, 6333);
    			attr_dev(span5, "class", "nav-link");
    			attr_dev(span5, "title", "snippets");
    			add_location(span5, file$9, 63, 20, 6267);
    			attr_dev(li6, "class", "nav-item");
    			add_location(li6, file$9, 62, 16, 6176);
    			attr_dev(ul0, "class", "navbar-nav");
    			add_location(ul0, file$9, 29, 12, 1907);
    			attr_dev(div3, "class", "collapse navbar-collapse justify-content-end");
    			attr_dev(div3, "id", "navbarNav");
    			add_location(div3, file$9, 28, 8, 1820);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$9, 11, 4, 333);
    			attr_dev(nav, "class", "navbar navbar-expand-md navbar-dark fixed-top bg-custom border-bottom border-opacity-10");
    			add_location(nav, file$9, 10, 0, 226);
    			attr_dev(g9, "id", "SVGRepo_bgCarrier");
    			attr_dev(g9, "stroke-width", "0");
    			add_location(g9, file$9, 76, 119, 8007);
    			attr_dev(g10, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g10, "stroke-linecap", "round");
    			attr_dev(g10, "stroke-linejoin", "round");
    			add_location(g10, file$9, 76, 167, 8055);
    			attr_dev(rect0, "width", "8");
    			attr_dev(rect0, "height", "8");
    			attr_dev(rect0, "rx", "2");
    			add_location(rect0, file$9, 76, 317, 8205);
    			attr_dev(rect1, "width", "8");
    			attr_dev(rect1, "height", "8");
    			attr_dev(rect1, "x", "10");
    			attr_dev(rect1, "rx", "2");
    			add_location(rect1, file$9, 76, 359, 8247);
    			attr_dev(rect2, "width", "8");
    			attr_dev(rect2, "height", "8");
    			attr_dev(rect2, "x", "10");
    			attr_dev(rect2, "y", "10");
    			attr_dev(rect2, "rx", "2");
    			add_location(rect2, file$9, 76, 408, 8296);
    			attr_dev(rect3, "width", "8");
    			attr_dev(rect3, "height", "8");
    			attr_dev(rect3, "y", "10");
    			attr_dev(rect3, "rx", "2");
    			add_location(rect3, file$9, 76, 464, 8352);
    			attr_dev(g11, "fill", "#ffffff");
    			attr_dev(g11, "fill-rule", "nonzero");
    			add_location(g11, file$9, 76, 278, 8166);
    			attr_dev(g12, "id", "SVGRepo_iconCarrier");
    			add_location(g12, file$9, 76, 249, 8137);
    			attr_dev(svg3, "width", "1.7rem");
    			attr_dev(svg3, "height", "1.7rem");
    			attr_dev(svg3, "viewBox", "0 0 18 18");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "fill", "#ffffff");
    			add_location(svg3, file$9, 76, 12, 7900);
    			attr_dev(div5, "class", "offcanvas-header-logo-padding");
    			add_location(div5, file$9, 75, 8, 7843);
    			attr_dev(g13, "id", "SVGRepo_bgCarrier");
    			attr_dev(g13, "stroke-width", "0");
    			add_location(g13, file$9, 80, 140, 8712);
    			attr_dev(g14, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g14, "stroke-linecap", "round");
    			attr_dev(g14, "stroke-linejoin", "round");
    			add_location(g14, file$9, 80, 188, 8760);
    			attr_dev(path6, "d", "M19.9201 15.0501L13.4001 8.53014C12.6301 7.76014 11.3701 7.76014 10.6001 8.53014L4.08008 15.0501");
    			attr_dev(path6, "stroke", "#ffffff");
    			attr_dev(path6, "stroke-width", "1.5");
    			attr_dev(path6, "stroke-miterlimit", "10");
    			attr_dev(path6, "stroke-linecap", "round");
    			attr_dev(path6, "stroke-linejoin", "round");
    			add_location(path6, file$9, 80, 299, 8871);
    			attr_dev(g15, "id", "SVGRepo_iconCarrier");
    			add_location(g15, file$9, 80, 270, 8842);
    			attr_dev(svg4, "width", "1.7rem");
    			attr_dev(svg4, "height", "1.7rem");
    			attr_dev(svg4, "viewBox", "0 0 24 24");
    			attr_dev(svg4, "fill", "none");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "transform", "rotate(270)");
    			add_location(svg4, file$9, 80, 12, 8584);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "aria-label", "offcanvas dismiss");
    			attr_dev(button1, "data-bs-dismiss", "offcanvas");
    			attr_dev(button1, "class", "btn bg-transparent border-0");
    			add_location(button1, file$9, 79, 8, 8453);
    			attr_dev(div6, "class", "offcanvas-header");
    			add_location(div6, file$9, 74, 4, 7803);
    			attr_dev(g16, "id", "SVGRepo_bgCarrier");
    			attr_dev(g16, "stroke-width", "0");
    			add_location(g16, file$9, 90, 124, 9654);
    			attr_dev(path7, "d", "M19 7.90637V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V7.90637M2 10.0001L10.8531 3.80297C11.5417 3.32092 12.4583 3.32092 13.1469 3.80297L22 10.0001");
    			attr_dev(path7, "stroke", "#ffffff");
    			attr_dev(path7, "stroke-width", "2.4");
    			attr_dev(path7, "stroke-linecap", "round");
    			attr_dev(path7, "stroke-linejoin", "round");
    			add_location(path7, file$9, 90, 286, 9816);
    			attr_dev(g17, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g17, "stroke-linecap", "round");
    			attr_dev(g17, "stroke-linejoin", "round");
    			attr_dev(g17, "stroke", "#f4f0f0");
    			attr_dev(g17, "stroke-width", "4.8");
    			add_location(g17, file$9, 90, 172, 9702);
    			attr_dev(path8, "d", "M19 7.90637V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V7.90637M2 10.0001L10.8531 3.80297C11.5417 3.32092 12.4583 3.32092 13.1469 3.80297L22 10.0001");
    			attr_dev(path8, "stroke", "#ffffff");
    			attr_dev(path8, "stroke-width", "2.4");
    			attr_dev(path8, "stroke-linecap", "round");
    			attr_dev(path8, "stroke-linejoin", "round");
    			add_location(path8, file$9, 90, 585, 10115);
    			attr_dev(g18, "id", "SVGRepo_iconCarrier");
    			add_location(g18, file$9, 90, 556, 10086);
    			attr_dev(svg5, "width", "1.7rem");
    			attr_dev(svg5, "height", "1.7rem");
    			attr_dev(svg5, "viewBox", "0 0 24 24");
    			attr_dev(svg5, "fill", "none");
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg5, file$9, 90, 20, 9550);
    			attr_dev(span6, "class", "align-bottom mx-1");
    			toggle_class(span6, "text-white", /*$selectedNavItem*/ ctx[0] === 'home');
    			add_location(span6, file$9, 91, 25, 10418);
    			attr_dev(span7, "class", "nav-link");
    			add_location(span7, file$9, 89, 16, 9505);
    			attr_dev(li7, "class", "nav-item");
    			attr_dev(li7, "data-bs-dismiss", "offcanvas");
    			add_location(li7, file$9, 88, 12, 9394);
    			attr_dev(g19, "id", "SVGRepo_bgCarrier");
    			attr_dev(g19, "stroke-width", "0");
    			add_location(g19, file$9, 98, 143, 10933);
    			attr_dev(g20, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g20, "stroke-linecap", "round");
    			attr_dev(g20, "stroke-linejoin", "round");
    			add_location(g20, file$9, 98, 191, 10981);
    			attr_dev(path9, "fill-rule", "evenodd");
    			attr_dev(path9, "clip-rule", "evenodd");
    			attr_dev(path9, "d", "M5.4 2h13.2A3.4 3.4 0 0 1 22 5.4v13.2a3.4 3.4 0 0 1-3.4 3.4H5.4A3.4 3.4 0 0 1 2 18.6V5.4A3.4 3.4 0 0 1 5.4 2ZM7 5a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm5 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm6 1a1 1 0 1 0-2 0v10a1 1 0 1 0 2 0V6Z");
    			attr_dev(path9, "fill", "#ffffff");
    			add_location(path9, file$9, 98, 302, 11092);
    			attr_dev(g21, "id", "SVGRepo_iconCarrier");
    			add_location(g21, file$9, 98, 273, 11063);
    			attr_dev(svg6, "width", "1.67rem");
    			attr_dev(svg6, "height", "1.67rem");
    			attr_dev(svg6, "viewBox", "0 0 24 24");
    			attr_dev(svg6, "fill", "none");
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg6, "stroke", "#ffffff");
    			add_location(svg6, file$9, 98, 20, 10810);
    			attr_dev(span8, "class", "align-bottom mx-1");
    			toggle_class(span8, "text-white", /*$selectedNavItem*/ ctx[0] === 'projects');
    			add_location(span8, file$9, 99, 25, 11453);
    			attr_dev(span9, "class", "nav-link");
    			add_location(span9, file$9, 97, 16, 10765);
    			attr_dev(li8, "class", "nav-item");
    			attr_dev(li8, "data-bs-dismiss", "offcanvas");
    			add_location(li8, file$9, 96, 12, 10650);
    			attr_dev(g22, "id", "SVGRepo_bgCarrier");
    			attr_dev(g22, "stroke-width", "0");
    			add_location(g22, file$9, 105, 146, 11907);
    			attr_dev(g23, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g23, "stroke-linecap", "round");
    			attr_dev(g23, "stroke-linejoin", "round");
    			add_location(g23, file$9, 105, 194, 11955);
    			attr_dev(path10, "d", "M20.991,10H19.42a1.039,1.039,0,0,1-.951-.674l-.005-.013a1.04,1.04,0,0,1,.2-1.146l1.11-1.11a1.01,1.01,0,0,0,0-1.428l-1.4-1.4a1.01,1.01,0,0,0-1.428,0l-1.11,1.11a1.04,1.04,0,0,1-1.146.2l-.013,0A1.04,1.04,0,0,1,14,4.579V3.009A1.009,1.009,0,0,0,12.991,2H11.009A1.009,1.009,0,0,0,10,3.009v1.57a1.04,1.04,0,0,1-.674.952l-.013,0a1.04,1.04,0,0,1-1.146-.2l-1.11-1.11a1.01,1.01,0,0,0-1.428,0l-1.4,1.4a1.01,1.01,0,0,0,0,1.428l1.11,1.11a1.04,1.04,0,0,1,.2,1.146l0,.013A1.039,1.039,0,0,1,4.58,10H3.009A1.009,1.009,0,0,0,2,11.009v1.982A1.009,1.009,0,0,0,3.009,14H4.58a1.039,1.039,0,0,1,.951.674l0,.013a1.04,1.04,0,0,1-.2,1.146l-1.11,1.11a1.01,1.01,0,0,0,0,1.428l1.4,1.4a1.01,1.01,0,0,0,1.428,0l1.11-1.11a1.04,1.04,0,0,1,1.146-.2l.013.005A1.039,1.039,0,0,1,10,19.42v1.571A1.009,1.009,0,0,0,11.009,22h1.982A1.009,1.009,0,0,0,14,20.991V19.42a1.039,1.039,0,0,1,.674-.951l.013-.005a1.04,1.04,0,0,1,1.146.2l1.11,1.11a1.01,1.01,0,0,0,1.428,0l1.4-1.4a1.01,1.01,0,0,0,0-1.428l-1.11-1.11a1.04,1.04,0,0,1-.2-1.146l.005-.013A1.039,1.039,0,0,1,19.42,14h1.571A1.009,1.009,0,0,0,22,12.991V11.009A1.009,1.009,0,0,0,20.991,10ZM12,15a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z");
    			add_location(path10, file$9, 105, 305, 12066);
    			attr_dev(g24, "id", "SVGRepo_iconCarrier");
    			add_location(g24, file$9, 105, 276, 12037);
    			attr_dev(svg7, "fill", "#ffffff");
    			attr_dev(svg7, "width", "1.67rem");
    			attr_dev(svg7, "height", "1.67rem");
    			attr_dev(svg7, "viewBox", "0 0 24 24");
    			attr_dev(svg7, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg7, "stroke", "#ffffff");
    			add_location(svg7, file$9, 105, 20, 11781);
    			attr_dev(span10, "class", "align-bottom mx-1");
    			toggle_class(span10, "text-white", /*$selectedNavItem*/ ctx[0] === 'skills');
    			add_location(span10, file$9, 106, 25, 13254);
    			attr_dev(span11, "class", "nav-link");
    			add_location(span11, file$9, 104, 16, 11736);
    			attr_dev(li9, "class", "nav-item");
    			attr_dev(li9, "data-bs-dismiss", "offcanvas");
    			add_location(li9, file$9, 103, 12, 11623);
    			attr_dev(g25, "id", "SVGRepo_bgCarrier");
    			attr_dev(g25, "stroke-width", "0");
    			add_location(g25, file$9, 112, 243, 13791);
    			attr_dev(g26, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g26, "stroke-linecap", "round");
    			attr_dev(g26, "stroke-linejoin", "round");
    			add_location(g26, file$9, 112, 291, 13839);
    			attr_dev(path11, "id", "primary");
    			attr_dev(path11, "d", "M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,8,8,0,0,1,1.79-5,2,2,0,0,1,2.67-.39,8.07,8.07,0,0,0,9.07,0,2,2,0,0,1,2.68.39A8,8,0,0,1,21,20Zm-9-6A6,6,0,1,0,6,8,6,6,0,0,0,12,14Z");
    			set_style(path11, "fill", "#ffffff");
    			add_location(path11, file$9, 112, 402, 13950);
    			attr_dev(g27, "id", "SVGRepo_iconCarrier");
    			add_location(g27, file$9, 112, 373, 13921);
    			attr_dev(svg8, "fill", "#ffffff");
    			attr_dev(svg8, "width", "1.67rem");
    			attr_dev(svg8, "height", "1.67rem");
    			attr_dev(svg8, "viewBox", "0 0 24 24");
    			attr_dev(svg8, "id", "user-3");
    			attr_dev(svg8, "data-name", "Flat Color");
    			attr_dev(svg8, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg8, "class", "icon flat-color");
    			attr_dev(svg8, "stroke", "#ffffff");
    			attr_dev(svg8, "stroke-width", "0.00024000000000000003");
    			add_location(svg8, file$9, 112, 20, 13568);
    			attr_dev(span12, "class", "align-bottom mx-1");
    			toggle_class(span12, "text-white", /*$selectedNavItem*/ ctx[0] === 'blog');
    			add_location(span12, file$9, 113, 25, 14209);
    			attr_dev(span13, "class", "nav-link");
    			add_location(span13, file$9, 111, 16, 13523);
    			attr_dev(li10, "class", "nav-item");
    			attr_dev(li10, "data-bs-dismiss", "offcanvas");
    			add_location(li10, file$9, 110, 12, 13412);
    			attr_dev(g28, "id", "SVGRepo_bgCarrier");
    			attr_dev(g28, "stroke-width", "0");
    			add_location(g28, file$9, 119, 131, 14642);
    			attr_dev(g29, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g29, "stroke-linecap", "round");
    			attr_dev(g29, "stroke-linejoin", "round");
    			attr_dev(g29, "stroke", "#CCCCCC");
    			attr_dev(g29, "stroke-width", "1.152");
    			add_location(g29, file$9, 119, 178, 14689);
    			attr_dev(path12, "fill-rule", "evenodd");
    			attr_dev(path12, "clip-rule", "evenodd");
    			attr_dev(path12, "d", "M11.372 0.189436C11.7526 -0.0631454 12.2474 -0.0631454 12.628 0.189436L23.4922 7.39931C23.8094 7.60977 24 7.96507 24 8.34568V15.6543C24 16.0349 23.8094 16.3902 23.4922 16.6007L12.628 23.8106C12.2474 24.0631 11.7526 24.0631 11.372 23.8106L0.507759 16.6007C0.190634 16.3902 0 16.0349 0 15.6543V8.34568C0 7.96507 0.190634 7.60977 0.507759 7.39931L11.372 0.189436ZM2.27161 10.4626V13.5213L4.56046 11.9816L2.27161 10.4626ZM6.60915 13.3411L3.1802 15.6479L10.8642 20.7473V16.165L6.60915 13.3411ZM13.1358 16.165V20.7473L20.8198 15.6479L17.3909 13.3411L13.1358 16.165ZM19.4395 11.9816L21.7284 13.5213V10.4626L19.4395 11.9816ZM20.8101 8.34568L17.3994 10.6091L13.1358 7.74087V3.25272L20.8101 8.34568ZM10.8642 3.25272V7.74087L6.60056 10.6091L3.18988 8.34568L10.8642 3.25272ZM12 9.71457L8.64925 11.9687L12 14.1924L15.3508 11.9687L12 9.71457Z");
    			attr_dev(path12, "fill", "#ffffff");
    			add_location(path12, file$9, 119, 326, 14837);
    			attr_dev(g30, "id", "SVGRepo_iconCarrier");
    			add_location(g30, file$9, 119, 297, 14808);
    			attr_dev(svg9, "width", "1.67rem");
    			attr_dev(svg9, "height", "1.67rem");
    			attr_dev(svg9, "viewBox", "0 0 24.00 24.00");
    			attr_dev(svg9, "fill", "none");
    			attr_dev(svg9, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg9, file$9, 119, 20, 14531);
    			attr_dev(span14, "class", "align-bottom mx-1");
    			toggle_class(span14, "text-white", /*$selectedNavItem*/ ctx[0] === 'snippets');
    			add_location(span14, file$9, 120, 25, 15776);
    			attr_dev(span15, "class", "nav-link");
    			add_location(span15, file$9, 118, 16, 14486);
    			attr_dev(li11, "class", "nav-item");
    			attr_dev(li11, "data-bs-dismiss", "offcanvas");
    			add_location(li11, file$9, 117, 12, 14371);
    			attr_dev(g31, "id", "SVGRepo_bgCarrier");
    			attr_dev(g31, "stroke-width", "0");
    			add_location(g31, file$9, 126, 147, 16224);
    			attr_dev(g32, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g32, "stroke-linecap", "round");
    			attr_dev(g32, "stroke-linejoin", "round");
    			add_location(g32, file$9, 126, 194, 16271);
    			attr_dev(path13, "d", "M112.941 451.765h338.824V112.94H112.94v338.824zM508.235 0H56.471C25.299 0 0 25.299 0 56.47v451.765c0 31.172 25.299 56.47 56.47 56.47h451.765c31.172 0 56.47-25.298 56.47-56.47V56.471C564.706 25.299 539.408 0 508.236 0zm282.353 451.765h338.824V112.94H790.588v338.824zM1185.882 0H734.118c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.47 56.47 56.47h451.764c31.172 0 56.47-25.298 56.47-56.47V56.471c0-31.172-25.298-56.471-56.47-56.471zm282.353 451.765h338.824V112.94h-338.824v338.824zM1863.53 0h-451.764c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.47 56.47 56.47h451.764c31.172 0 56.471-25.298 56.471-56.47V56.471C1920 25.299 1894.701 0 1863.53 0zM112.941 1129.412h338.824V790.588H112.94v338.824zm395.294-451.765H56.471C25.299 677.647 0 702.946 0 734.117v451.765c0 31.172 25.299 56.47 56.47 56.47h451.765c31.172 0 56.47-25.298 56.47-56.47V734.118c0-31.172-25.298-56.47-56.47-56.47zm282.353 451.765h338.824V790.588H790.588v338.824zm395.294-451.765H734.118c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.47 56.47 56.47h451.764c31.172 0 56.47-25.298 56.47-56.47V734.118c0-31.172-25.298-56.47-56.47-56.47zm282.353 451.765h338.824V790.588h-338.824v338.824zm395.294-451.765h-451.764c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.47 56.47 56.47h451.764c31.172 0 56.471-25.298 56.471-56.47V734.118c0-31.172-25.299-56.47-56.47-56.47zM112.941 1807.06h338.824v-338.824H112.94v338.824zm395.294-451.765H56.471c-31.172 0-56.471 25.299-56.471 56.47v451.765c0 31.171 25.299 56.47 56.47 56.47h451.765c31.172 0 56.47-25.299 56.47-56.47v-451.765c0-31.172-25.298-56.47-56.47-56.47zm282.353 451.765h338.824v-338.824H790.588v338.824zm395.294-451.765H734.118c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.471 56.47 56.471h451.764c31.172 0 56.47-25.299 56.47-56.47v-451.765c0-31.172-25.298-56.47-56.47-56.47zm282.353 451.765h338.824v-338.824h-338.824v338.824zm395.294-451.765h-451.764c-31.172 0-56.47 25.299-56.47 56.47v451.765c0 31.172 25.298 56.471 56.47 56.471h451.764c31.172 0 56.471-25.299 56.471-56.47v-451.765c0-31.172-25.299-56.47-56.47-56.47z");
    			attr_dev(path13, "fill-rule", "evenodd");
    			add_location(path13, file$9, 126, 304, 16381);
    			attr_dev(g33, "id", "SVGRepo_iconCarrier");
    			add_location(g33, file$9, 126, 275, 16352);
    			attr_dev(svg10, "fill", "#ffffff");
    			attr_dev(svg10, "width", "1.6rem");
    			attr_dev(svg10, "height", "1.6rem");
    			attr_dev(svg10, "viewBox", "0 0 1920 1920");
    			attr_dev(svg10, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg10, "stroke", "#ffffff");
    			add_location(svg10, file$9, 126, 20, 16097);
    			attr_dev(span16, "class", "align-bottom mx-1");
    			toggle_class(span16, "text-white", /*$selectedNavItem*/ ctx[0] === 'collections');
    			add_location(span16, file$9, 127, 25, 18561);
    			attr_dev(span17, "class", "nav-link");
    			add_location(span17, file$9, 125, 16, 16052);
    			attr_dev(li12, "class", "nav-item");
    			attr_dev(li12, "data-bs-dismiss", "offcanvas");
    			add_location(li12, file$9, 124, 12, 15934);
    			attr_dev(g34, "id", "SVGRepo_bgCarrier");
    			attr_dev(g34, "stroke-width", "0");
    			add_location(g34, file$9, 133, 142, 18982);
    			attr_dev(g35, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g35, "stroke-linecap", "round");
    			attr_dev(g35, "stroke-linejoin", "round");
    			add_location(g35, file$9, 133, 189, 19029);
    			attr_dev(path14, "d", "M20 12.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.1198 22 8.79986 22H12.5M14 11H8M10 15H8M16 7H8M15 19L18 22M18 22L21 19M18 22V16");
    			attr_dev(path14, "stroke", "#ffffff");
    			attr_dev(path14, "stroke-width", "2");
    			attr_dev(path14, "stroke-linecap", "round");
    			attr_dev(path14, "stroke-linejoin", "round");
    			add_location(path14, file$9, 133, 299, 19139);
    			attr_dev(g36, "id", "SVGRepo_iconCarrier");
    			add_location(g36, file$9, 133, 270, 19110);
    			attr_dev(svg11, "width", "1.67rem");
    			attr_dev(svg11, "height", "1.67rem");
    			attr_dev(svg11, "viewBox", "0 0 24 24");
    			attr_dev(svg11, "fill", "none");
    			attr_dev(svg11, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg11, "stroke", "#ffffff");
    			add_location(svg11, file$9, 133, 20, 18860);
    			attr_dev(span18, "class", "align-bottom mx-1");
    			add_location(span18, file$9, 134, 26, 19690);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "assets/files/Suyash_Jawale_Resume.pdf");
    			attr_dev(a1, "download", "");
    			add_location(a1, file$9, 132, 16, 18764);
    			attr_dev(li13, "class", "nav-item");
    			add_location(li13, file$9, 131, 12, 18725);
    			attr_dev(ul1, "class", "navbar-nav justify-content-end flex-grow-1 pe-3");
    			add_location(ul1, file$9, 86, 8, 9250);
    			attr_dev(div7, "class", "offcanvas-body");
    			add_location(div7, file$9, 84, 4, 9146);
    			attr_dev(div8, "class", "offcanvas offcanvas-start bg-custom shadow");
    			attr_dev(div8, "tabindex", "-1");
    			attr_dev(div8, "id", "offcanvasNavbar");
    			attr_dev(div8, "aria-labelledby", "offcanvasNavbarLabel");
    			add_location(div8, file$9, 73, 0, 7667);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div4);
    			append_dev(div4, div2);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			if_blocks[current_block_type_index].m(div1, null);
    			append_dev(div4, t3);
    			append_dev(div4, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, g0);
    			append_dev(svg0, g1);
    			append_dev(svg0, g2);
    			append_dev(g2, title);
    			append_dev(g2, path0);
    			append_dev(g2, path1);
    			append_dev(g2, path2);
    			append_dev(g2, path3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, span0);
    			append_dev(ul0, t6);
    			append_dev(ul0, li1);
    			append_dev(li1, span1);
    			append_dev(ul0, t8);
    			append_dev(ul0, li2);
    			append_dev(li2, span2);
    			append_dev(ul0, t10);
    			append_dev(ul0, li3);
    			append_dev(li3, span3);
    			append_dev(ul0, t12);
    			append_dev(ul0, li4);
    			append_dev(li4, a0);
    			append_dev(ul0, t14);
    			append_dev(ul0, li5);
    			append_dev(li5, span4);
    			append_dev(span4, svg1);
    			append_dev(svg1, g3);
    			append_dev(svg1, g4);
    			append_dev(svg1, g5);
    			append_dev(g5, path4);
    			append_dev(ul0, t15);
    			append_dev(ul0, li6);
    			append_dev(li6, span5);
    			append_dev(span5, svg2);
    			append_dev(svg2, g6);
    			append_dev(svg2, g7);
    			append_dev(svg2, g8);
    			append_dev(g8, path5);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			append_dev(div6, div5);
    			append_dev(div5, svg3);
    			append_dev(svg3, g9);
    			append_dev(svg3, g10);
    			append_dev(svg3, g12);
    			append_dev(g12, g11);
    			append_dev(g11, rect0);
    			append_dev(g11, rect1);
    			append_dev(g11, rect2);
    			append_dev(g11, rect3);
    			append_dev(div6, t17);
    			append_dev(div6, button1);
    			append_dev(button1, svg4);
    			append_dev(svg4, g13);
    			append_dev(svg4, g14);
    			append_dev(svg4, g15);
    			append_dev(g15, path6);
    			append_dev(div8, t18);
    			append_dev(div8, div7);
    			append_dev(div7, ul1);
    			append_dev(ul1, li7);
    			append_dev(li7, span7);
    			append_dev(span7, svg5);
    			append_dev(svg5, g16);
    			append_dev(svg5, g17);
    			append_dev(g17, path7);
    			append_dev(svg5, g18);
    			append_dev(g18, path8);
    			append_dev(span7, t19);
    			append_dev(span7, span6);
    			append_dev(ul1, t21);
    			append_dev(ul1, li8);
    			append_dev(li8, span9);
    			append_dev(span9, svg6);
    			append_dev(svg6, g19);
    			append_dev(svg6, g20);
    			append_dev(svg6, g21);
    			append_dev(g21, path9);
    			append_dev(span9, t22);
    			append_dev(span9, span8);
    			append_dev(ul1, t24);
    			append_dev(ul1, li9);
    			append_dev(li9, span11);
    			append_dev(span11, svg7);
    			append_dev(svg7, g22);
    			append_dev(svg7, g23);
    			append_dev(svg7, g24);
    			append_dev(g24, path10);
    			append_dev(span11, t25);
    			append_dev(span11, span10);
    			append_dev(ul1, t27);
    			append_dev(ul1, li10);
    			append_dev(li10, span13);
    			append_dev(span13, svg8);
    			append_dev(svg8, g25);
    			append_dev(svg8, g26);
    			append_dev(svg8, g27);
    			append_dev(g27, path11);
    			append_dev(span13, t28);
    			append_dev(span13, span12);
    			append_dev(ul1, t30);
    			append_dev(ul1, li11);
    			append_dev(li11, span15);
    			append_dev(span15, svg9);
    			append_dev(svg9, g28);
    			append_dev(svg9, g29);
    			append_dev(svg9, g30);
    			append_dev(g30, path12);
    			append_dev(span15, t31);
    			append_dev(span15, span14);
    			append_dev(ul1, t33);
    			append_dev(ul1, li12);
    			append_dev(li12, span17);
    			append_dev(span17, svg10);
    			append_dev(svg10, g31);
    			append_dev(svg10, g32);
    			append_dev(svg10, g33);
    			append_dev(g33, path13);
    			append_dev(span17, t34);
    			append_dev(span17, span16);
    			append_dev(ul1, t36);
    			append_dev(ul1, li13);
    			append_dev(li13, a1);
    			append_dev(a1, svg11);
    			append_dev(svg11, g34);
    			append_dev(svg11, g35);
    			append_dev(svg11, g36);
    			append_dev(g36, path14);
    			append_dev(a1, t37);
    			append_dev(a1, span18);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li0, "click", /*click_handler*/ ctx[3], false, false, false, false),
    					listen_dev(li1, "click", /*click_handler_1*/ ctx[4], false, false, false, false),
    					listen_dev(li2, "click", /*click_handler_2*/ ctx[5], false, false, false, false),
    					listen_dev(li3, "click", /*click_handler_3*/ ctx[6], false, false, false, false),
    					listen_dev(li5, "click", /*click_handler_4*/ ctx[7], false, false, false, false),
    					listen_dev(li6, "click", /*click_handler_5*/ ctx[8], false, false, false, false),
    					listen_dev(li7, "click", /*click_handler_6*/ ctx[9], false, false, false, false),
    					listen_dev(li8, "click", /*click_handler_7*/ ctx[10], false, false, false, false),
    					listen_dev(li9, "click", /*click_handler_8*/ ctx[11], false, false, false, false),
    					listen_dev(li10, "click", /*click_handler_9*/ ctx[12], false, false, false, false),
    					listen_dev(li11, "click", /*click_handler_10*/ ctx[13], false, false, false, false),
    					listen_dev(li12, "click", /*click_handler_11*/ ctx[14], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span0, "active", /*$selectedNavItem*/ ctx[0] === 'home');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span1, "active", /*$selectedNavItem*/ ctx[0] === 'projects');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span2, "active", /*$selectedNavItem*/ ctx[0] === 'skills');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span3, "active", /*$selectedNavItem*/ ctx[0] === 'blog');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span6, "text-white", /*$selectedNavItem*/ ctx[0] === 'home');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span8, "text-white", /*$selectedNavItem*/ ctx[0] === 'projects');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span10, "text-white", /*$selectedNavItem*/ ctx[0] === 'skills');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span12, "text-white", /*$selectedNavItem*/ ctx[0] === 'blog');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span14, "text-white", /*$selectedNavItem*/ ctx[0] === 'snippets');
    			}

    			if (!current || dirty & /*$selectedNavItem*/ 1) {
    				toggle_class(span16, "text-white", /*$selectedNavItem*/ ctx[0] === 'collections');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div8);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $selectedNavItem;
    	validate_store(selectedNavItem, 'selectedNavItem');
    	component_subscribe($$self, selectedNavItem, $$value => $$invalidate(0, $selectedNavItem = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let ip;

    	function handleNavItemClick(item) {
    		selectedNavItem.set(item);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleNavItemClick('home');
    	const click_handler_1 = () => handleNavItemClick('projects');
    	const click_handler_2 = () => handleNavItemClick('skills');
    	const click_handler_3 = () => handleNavItemClick('blog');
    	const click_handler_4 = () => handleNavItemClick('collections');
    	const click_handler_5 = () => handleNavItemClick('snippets');
    	const click_handler_6 = () => handleNavItemClick('home');
    	const click_handler_7 = () => handleNavItemClick('projects');
    	const click_handler_8 = () => handleNavItemClick('skills');
    	const click_handler_9 = () => handleNavItemClick('blog');
    	const click_handler_10 = () => handleNavItemClick('snippets');
    	const click_handler_11 = () => handleNavItemClick('collections');

    	$$self.$capture_state = () => ({
    		fade,
    		selectedNavItem,
    		ip,
    		handleNavItemClick,
    		$selectedNavItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('ip' in $$props) $$invalidate(1, ip = $$props.ip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		$selectedNavItem,
    		ip,
    		handleNavItemClick,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\LinearEquilibrium.svelte generated by Svelte v3.56.0 */
    const file$8 = "src\\LinearEquilibrium.svelte";

    // (113:0) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let t;
    	let span;
    	let svg;
    	let g0;
    	let g1;
    	let g3;
    	let path0;
    	let path1;
    	let path2;
    	let g2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;
    	let div_intro;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text("Hi, I'm Suyash from India ");
    			span = element("span");
    			svg = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g3 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			g2 = svg_element("g");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$8, 114, 258, 3737);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$8, 114, 305, 3784);
    			set_style(path0, "fill", "#FFFFFF");
    			attr_dev(path0, "d", "M512,400.144c-170.667,69.189-341.333-69.189-512,0c0-96.096,0-192.193,0-288.288 c170.667-69.189,341.333,69.189,512,0C512,207.952,512,304.048,512,400.144z");
    			add_location(path0, file$8, 114, 415, 3894);
    			set_style(path1, "fill", "#F4C653");
    			attr_dev(path1, "d", "M0,207.952c170.667-69.189,341.333,69.189,512,0v-96.096c-170.667,69.189-341.333-69.189-512,0");
    			add_location(path1, file$8, 114, 608, 4087);
    			set_style(path2, "fill", "#87E87C");
    			attr_dev(path2, "d", "M0,400.144c170.667-69.189,341.333,69.189,512,0v-96.096c-170.667,69.189-341.333-69.189-512,0");
    			add_location(path2, file$8, 114, 740, 4219);
    			set_style(path3, "fill", "#53BEF4");
    			attr_dev(path3, "d", "M253.694,229.141c1.195,4.093,1.814,8.184,2.259,12.276c0.423,4.093,0.619,8.184,0.623,12.276 c0.005,4.093-0.193,8.184-0.615,12.276c-0.444,4.093-1.066,8.184-2.267,12.276c-1.202-4.093-1.823-8.184-2.267-12.276 c-0.422-4.093-0.619-8.184-0.616-12.276c0.003-4.093,0.201-8.184,0.623-12.276C251.88,237.325,252.499,233.233,253.694,229.141z");
    			add_location(path3, file$8, 114, 876, 4355);
    			set_style(path4, "fill", "#53BEF4");
    			attr_dev(path4, "d", "M271.056,236.332c-2.049,3.739-4.505,7.069-7.084,10.278c-2.595,3.193-5.349,6.225-8.24,9.121 c-2.89,2.897-5.924,5.65-9.116,8.246c-3.207,2.58-6.541,5.034-10.284,7.078c2.045-3.743,4.498-7.076,7.078-10.284 c2.595-3.192,5.348-6.226,8.246-9.116c2.896-2.891,5.928-5.646,9.121-8.24C263.986,240.837,267.317,238.381,271.056,236.332z");
    			add_location(path4, file$8, 114, 1245, 4724);
    			set_style(path5, "fill", "#53BEF4");
    			attr_dev(path5, "d", "M278.247,253.694c-4.093,1.195-8.184,1.814-12.276,2.259c-4.093,0.423-8.184,0.619-12.276,0.623 c-4.093,0.005-8.184-0.193-12.276-0.616c-4.093-0.444-8.184-1.066-12.276-2.267c4.093-1.202,8.184-1.823,12.276-2.267 c4.093-0.422,8.184-0.619,12.276-0.615c4.093,0.003,8.184,0.201,12.276,0.623C270.063,251.881,274.154,252.499,278.247,253.694z");
    			add_location(path5, file$8, 114, 1607, 5086);
    			set_style(path6, "fill", "#53BEF4");
    			attr_dev(path6, "d", "M271.056,271.056c-3.739-2.049-7.069-4.505-10.278-7.084c-3.193-2.595-6.225-5.349-9.121-8.24 c-2.897-2.89-5.65-5.924-8.246-9.116c-2.58-3.207-5.034-6.541-7.078-10.284c3.743,2.043,7.076,4.498,10.284,7.078 c3.192,2.595,6.226,5.349,9.116,8.246c2.891,2.896,5.646,5.928,8.24,9.121C266.55,263.986,269.006,267.317,271.056,271.056z");
    			add_location(path6, file$8, 114, 1978, 5457);
    			set_style(path7, "fill", "#53BEF4");
    			attr_dev(path7, "d", "M253.694,293.481c-21.939,0-39.787-17.849-39.787-39.787c0-21.939,17.849-39.787,39.787-39.787 c21.939,0,39.787,17.849,39.787,39.787C293.481,275.632,275.632,293.481,253.694,293.481z M253.694,219.672 c-18.759,0-34.021,15.262-34.021,34.021c0,18.76,15.262,34.021,34.021,34.021c18.76,0,34.021-15.262,34.021-34.021 C287.715,234.934,272.453,219.672,253.694,219.672z");
    			add_location(path7, file$8, 114, 2339, 5818);
    			add_location(g2, file$8, 114, 872, 4351);
    			attr_dev(g3, "id", "SVGRepo_iconCarrier");
    			add_location(g3, file$8, 114, 386, 3865);
    			attr_dev(svg, "height", "1.5rem");
    			attr_dev(svg, "width", "1.5rem");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "id", "Layer_1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			attr_dev(svg, "xml:space", "preserve");
    			attr_dev(svg, "fill", "#000000");
    			add_location(svg, file$8, 114, 59, 3538);
    			attr_dev(span, "class", "align-top");
    			add_location(span, file$8, 114, 35, 3514);
    			attr_dev(div, "class", "font-weight-500 declare");
    			add_location(div, file$8, 113, 2, 3415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			append_dev(div, span);
    			append_dev(span, svg);
    			append_dev(svg, g0);
    			append_dev(svg, g1);
    			append_dev(svg, g3);
    			append_dev(g3, path0);
    			append_dev(g3, path1);
    			append_dev(g3, path2);
    			append_dev(g3, g2);
    			append_dev(g2, path3);
    			append_dev(g2, path4);
    			append_dev(g2, path5);
    			append_dev(g2, path6);
    			append_dev(g2, path7);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { delay: 100 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(113:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (111:0) {#if !first}
    function create_if_block$4(ctx) {
    	let canvas_1;
    	let canvas_1_intro;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", "600");
    			attr_dev(canvas_1, "height", "600");
    			attr_dev(canvas_1, "class", "img-fluid profile-photo");
    			add_location(canvas_1, file$8, 111, 2, 3284);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[2](canvas_1);
    		},
    		p: noop,
    		i: function intro(local) {
    			if (!canvas_1_intro) {
    				add_render_callback(() => {
    					canvas_1_intro = create_in_transition(canvas_1, fade, { delay: 200 });
    					canvas_1_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(111:0) {#if !first}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*first*/ ctx[1]) return create_if_block$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LinearEquilibrium', slots, []);
    	let width = 600;
    	let height = 600;
    	let color = "#FFFFFF";

    	const generatePoints = n => {
    		const points = [];
    		const d = 2 * Math.PI / n;

    		for (let i = 0; i < n; i++) {
    			const x = width / 2 + (width / 2 - 20) * Math.cos(d * i);
    			const y = height / 2 + (height / 2 - 20) * Math.sin(d * i);
    			points.push([x, y]);
    		}

    		return points;
    	};

    	let canvas;
    	let ctx;

    	function animateLineDrawing(x1, y1, x2, y2) {
    		return new Promise((resolve, reject) => {
    				let start = performance.now();
    				let duration = 1000;

    				function animate(currentTime) {
    					let progress = (currentTime - start) / duration;

    					if (progress > 1) {
    						progress = 1;
    					}

    					ctx.beginPath();
    					ctx.moveTo(x1, y1);
    					ctx.lineTo(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress);
    					ctx.stroke();

    					if (progress < 1) requestAnimationFrame(animate); else {
    						resolve();
    						ctx.closePath();
    					}
    				}

    				requestAnimationFrame(animate);
    			});
    	}

    	const drawLines = points => {
    		return new Promise(async (resolve, reject) => {
    				try {
    					ctx = canvas.getContext("2d");
    					ctx.lineWidth = 2.7;
    					ctx.strokeStyle = color;
    					var delay = 0;

    					for (let i = 0; i < points.length; i++) {
    						for (let j = i + 1; j < points.length; j++) {
    							await animateLineDrawing(points[i][0], points[i][1], points[j][0], points[j][1]);

    							if (i === points.length - 2 && j === points.length - 1) {
    								setTimeout(
    									() => {
    										ctx.clearRect(0, 0, 600, 600);
    										resolve();
    									},
    									3000
    								);
    							}
    						}
    					}
    				} catch(err) {
    					reject();
    				}
    			});
    	};

    	const vectorEquilibrium = async n => {
    		const points = generatePoints(n);

    		try {
    			await drawLines(points);
    			nextStep();
    		} catch(e) {
    			
    		}
    	};

    	let i = 6;
    	let first = true;

    	const nextStep = () => {
    		if (i === 27) {
    			i = 6;
    		}

    		if (first) {
    			setTimeout(
    				() => {
    					$$invalidate(1, first = false);

    					setTimeout(
    						() => {
    							nextStep();
    						},
    						1000
    					);
    				},
    				4000
    			);
    		} else {
    			vectorEquilibrium(i++);
    		}
    	};

    	onMount(() => {
    		nextStep();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LinearEquilibrium> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		width,
    		height,
    		color,
    		generatePoints,
    		canvas,
    		ctx,
    		animateLineDrawing,
    		drawLines,
    		vectorEquilibrium,
    		i,
    		first,
    		nextStep
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) width = $$props.width;
    		if ('height' in $$props) height = $$props.height;
    		if ('color' in $$props) color = $$props.color;
    		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
    		if ('ctx' in $$props) ctx = $$props.ctx;
    		if ('i' in $$props) i = $$props.i;
    		if ('first' in $$props) $$invalidate(1, first = $$props.first);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [canvas, first, canvas_1_binding];
    }

    class LinearEquilibrium extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinearEquilibrium",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\Home.svelte generated by Svelte v3.56.0 */
    const file$7 = "src\\Home.svelte";

    // (55:11) {:else}
    function create_else_block$2(ctx) {
    	let t0_value = /*time_remaining*/ ctx[1][0] + "";
    	let t0;
    	let t1;
    	let t2_value = /*time_remaining*/ ctx[1][1] + "";
    	let t2;
    	let t3;
    	let t4_value = /*time_remaining*/ ctx[1][2] + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" Years, ");
    			t2 = text(t2_value);
    			t3 = text(" Months, ");
    			t4 = text(t4_value);
    			t5 = text(" Days");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*time_remaining*/ 2 && t0_value !== (t0_value = /*time_remaining*/ ctx[1][0] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*time_remaining*/ 2 && t2_value !== (t2_value = /*time_remaining*/ ctx[1][1] + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*time_remaining*/ 2 && t4_value !== (t4_value = /*time_remaining*/ ctx[1][2] + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(55:11) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:11) {#if show}
    function create_if_block$3(ctx) {
    	let t0_value = /*age*/ ctx[0][0] + "";
    	let t0;
    	let t1;
    	let t2_value = /*age*/ ctx[0][1] + "";
    	let t2;
    	let t3;
    	let t4_value = /*age*/ ctx[0][2] + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" Years, ");
    			t2 = text(t2_value);
    			t3 = text(" Months, ");
    			t4 = text(t4_value);
    			t5 = text(" Days");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*age*/ 1 && t0_value !== (t0_value = /*age*/ ctx[0][0] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*age*/ 1 && t2_value !== (t2_value = /*age*/ ctx[0][1] + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*age*/ 1 && t4_value !== (t4_value = /*age*/ ctx[0][2] + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(53:11) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div4;
    	let div0;
    	let linearequilibrium;
    	let t0;
    	let div1;
    	let t2;
    	let div2;
    	let a0;
    	let svg0;
    	let g0;
    	let rect0;
    	let g1;
    	let g2;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;
    	let t3;
    	let a1;
    	let svg1;
    	let g3;
    	let rect1;
    	let g4;
    	let g5;
    	let rect2;
    	let rect3;
    	let rect4;
    	let path8;
    	let path9;
    	let path10;
    	let defs0;
    	let radialGradient0;
    	let stop0;
    	let stop1;
    	let stop2;
    	let radialGradient1;
    	let stop3;
    	let stop4;
    	let stop5;
    	let stop6;
    	let radialGradient2;
    	let stop7;
    	let stop8;
    	let stop9;
    	let t4;
    	let a2;
    	let svg2;
    	let g6;
    	let rect5;
    	let g7;
    	let g8;
    	let path11;
    	let t5;
    	let a3;
    	let svg3;
    	let g9;
    	let g10;
    	let g13;
    	let title0;
    	let t6;
    	let desc;
    	let t7;
    	let defs1;
    	let g12;
    	let g11;
    	let rect6;
    	let path12;
    	let t8;
    	let a4;
    	let svg4;
    	let g14;
    	let rect7;
    	let g15;
    	let g16;
    	let title1;
    	let t9;
    	let path13;
    	let t10;
    	let a5;
    	let svg5;
    	let g17;
    	let rect8;
    	let g18;
    	let g19;
    	let path14;
    	let t11;
    	let a6;
    	let svg6;
    	let g20;
    	let g21;
    	let g22;
    	let rect9;
    	let path15;
    	let t12;
    	let div3;
    	let span;
    	let t13;
    	let div5;
    	let t15;
    	let div21;
    	let div20;
    	let h50;
    	let t17;
    	let div6;
    	let t19;
    	let small0;
    	let div9;
    	let div7;
    	let t21;
    	let div8;
    	let t22_value = /*exp*/ ctx[2][0] + "";
    	let t22;
    	let t23;
    	let t24_value = /*exp*/ ctx[2][1] + "";
    	let t24;
    	let t25;
    	let t26;
    	let div19;
    	let hr;
    	let t27;
    	let div18;
    	let div10;
    	let t29;
    	let div11;
    	let t31;
    	let div12;
    	let t33;
    	let div13;
    	let t35;
    	let div14;
    	let t37;
    	let div15;
    	let t39;
    	let div16;
    	let t41;
    	let div17;
    	let t43;
    	let div22;
    	let t45;
    	let div27;
    	let div26;
    	let h51;
    	let t47;
    	let div23;
    	let t49;
    	let div24;
    	let small1;
    	let t51;
    	let div25;
    	let current;
    	let mounted;
    	let dispose;
    	linearequilibrium = new LinearEquilibrium({ $$inline: true });

    	function select_block_type(ctx, dirty) {
    		if (/*show*/ ctx[3]) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			create_component(linearequilibrium.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "Engineer at Tata Consultancy Services";
    			t2 = space();
    			div2 = element("div");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			g0 = svg_element("g");
    			rect0 = svg_element("rect");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			t3 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			g3 = svg_element("g");
    			rect1 = svg_element("rect");
    			g4 = svg_element("g");
    			g5 = svg_element("g");
    			rect2 = svg_element("rect");
    			rect3 = svg_element("rect");
    			rect4 = svg_element("rect");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			path10 = svg_element("path");
    			defs0 = svg_element("defs");
    			radialGradient0 = svg_element("radialGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			stop2 = svg_element("stop");
    			radialGradient1 = svg_element("radialGradient");
    			stop3 = svg_element("stop");
    			stop4 = svg_element("stop");
    			stop5 = svg_element("stop");
    			stop6 = svg_element("stop");
    			radialGradient2 = svg_element("radialGradient");
    			stop7 = svg_element("stop");
    			stop8 = svg_element("stop");
    			stop9 = svg_element("stop");
    			t4 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			g6 = svg_element("g");
    			rect5 = svg_element("rect");
    			g7 = svg_element("g");
    			g8 = svg_element("g");
    			path11 = svg_element("path");
    			t5 = space();
    			a3 = element("a");
    			svg3 = svg_element("svg");
    			g9 = svg_element("g");
    			g10 = svg_element("g");
    			g13 = svg_element("g");
    			title0 = svg_element("title");
    			t6 = text("team-collaboration/version-control/github");
    			desc = svg_element("desc");
    			t7 = text("Created with Sketch.");
    			defs1 = svg_element("defs");
    			g12 = svg_element("g");
    			g11 = svg_element("g");
    			rect6 = svg_element("rect");
    			path12 = svg_element("path");
    			t8 = space();
    			a4 = element("a");
    			svg4 = svg_element("svg");
    			g14 = svg_element("g");
    			rect7 = svg_element("rect");
    			g15 = svg_element("g");
    			g16 = svg_element("g");
    			title1 = svg_element("title");
    			t9 = text("medium");
    			path13 = svg_element("path");
    			t10 = space();
    			a5 = element("a");
    			svg5 = svg_element("svg");
    			g17 = svg_element("g");
    			rect8 = svg_element("rect");
    			g18 = svg_element("g");
    			g19 = svg_element("g");
    			path14 = svg_element("path");
    			t11 = space();
    			a6 = element("a");
    			svg6 = svg_element("svg");
    			g20 = svg_element("g");
    			g21 = svg_element("g");
    			g22 = svg_element("g");
    			rect9 = svg_element("rect");
    			path15 = svg_element("path");
    			t12 = space();
    			div3 = element("div");
    			span = element("span");
    			if_block.c();
    			t13 = space();
    			div5 = element("div");
    			div5.textContent = "Experience";
    			t15 = space();
    			div21 = element("div");
    			div20 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Engineer";
    			t17 = space();
    			div6 = element("div");
    			div6.textContent = "Tata Consultancy Services";
    			t19 = space();
    			small0 = element("small");
    			div9 = element("div");
    			div7 = element("div");
    			div7.textContent = "Jan 2021 - Present";
    			t21 = space();
    			div8 = element("div");
    			t22 = text(t22_value);
    			t23 = text(" Years, ");
    			t24 = text(t24_value);
    			t25 = text(" Months");
    			t26 = space();
    			div19 = element("div");
    			hr = element("hr");
    			t27 = space();
    			div18 = element("div");
    			div10 = element("div");
    			div10.textContent = "•  \r\n                Proven ability to implement machine learning and deep learning models to solve real-world problems";
    			t29 = space();
    			div11 = element("div");
    			div11.textContent = "•  \r\n                Strong understanding of natural language processing techniques, including sentiment analysis and text classification";
    			t31 = space();
    			div12 = element("div");
    			div12.textContent = "•  \r\n                2+ years of professional experience in the field of machine learning and deep learning, with a focus on natural language processing.";
    			t33 = space();
    			div13 = element("div");
    			div13.textContent = "•  \r\n                Proficient in utilizing data analysis and visualization tools, such as Python, R, and SQL.";
    			t35 = space();
    			div14 = element("div");
    			div14.textContent = "•  \r\n                Experience in the deployment of machine learning models to production environments utilizing cloud-based platforms, such as AWS and GCP.";
    			t37 = space();
    			div15 = element("div");
    			div15.textContent = "•  \r\n                Solid understanding of data management and database management systems.";
    			t39 = space();
    			div16 = element("div");
    			div16.textContent = "•  \r\n                Experience in mentoring junior team members.";
    			t41 = space();
    			div17 = element("div");
    			div17.textContent = "•  \r\n                Worked with research and development team to optimize existing algorithms and improve performance.";
    			t43 = space();
    			div22 = element("div");
    			div22.textContent = "Education";
    			t45 = space();
    			div27 = element("div");
    			div26 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Master In Computer Science";
    			t47 = space();
    			div23 = element("div");
    			div23.textContent = "Pune University";
    			t49 = space();
    			div24 = element("div");
    			small1 = element("small");
    			small1.textContent = "June 2020 - June 2022";
    			t51 = space();
    			div25 = element("div");
    			div25.textContent = "CGPA 9.6";
    			attr_dev(div0, "class", "mt-2");
    			add_location(div0, file$7, 12, 4, 275);
    			attr_dev(div1, "class", "lh-lg fs-6 text-white");
    			add_location(div1, file$7, 15, 4, 341);
    			attr_dev(rect0, "x", "0");
    			attr_dev(rect0, "y", "0");
    			attr_dev(rect0, "width", "32.00");
    			attr_dev(rect0, "height", "32.00");
    			attr_dev(rect0, "rx", "6.4");
    			attr_dev(rect0, "fill", "#ffffff");
    			attr_dev(rect0, "strokewidth", "0");
    			add_location(rect0, file$7, 21, 167, 770);
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$7, 21, 123, 726);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$7, 21, 267, 870);
    			attr_dev(path0, "d", "M2 11.9556C2 8.47078 2 6.7284 2.67818 5.39739C3.27473 4.22661 4.22661 3.27473 5.39739 2.67818C6.7284 2 8.47078 2 11.9556 2H20.0444C23.5292 2 25.2716 2 26.6026 2.67818C27.7734 3.27473 28.7253 4.22661 29.3218 5.39739C30 6.7284 30 8.47078 30 11.9556V20.0444C30 23.5292 30 25.2716 29.3218 26.6026C28.7253 27.7734 27.7734 28.7253 26.6026 29.3218C25.2716 30 23.5292 30 20.0444 30H11.9556C8.47078 30 6.7284 30 5.39739 29.3218C4.22661 28.7253 3.27473 27.7734 2.67818 26.6026C2 25.2716 2 23.5292 2 20.0444V11.9556Z");
    			attr_dev(path0, "fill", "white");
    			add_location(path0, file$7, 21, 378, 981);
    			attr_dev(path1, "d", "M22.0515 8.52295L16.0644 13.1954L9.94043 8.52295V8.52421L9.94783 8.53053V15.0732L15.9954 19.8466L22.0515 15.2575V8.52295Z");
    			attr_dev(path1, "fill", "#EA4335");
    			add_location(path1, file$7, 21, 915, 1518);
    			attr_dev(path2, "d", "M23.6231 7.38639L22.0508 8.52292V15.2575L26.9983 11.459V9.17074C26.9983 9.17074 26.3978 5.90258 23.6231 7.38639Z");
    			attr_dev(path2, "fill", "#FBBC05");
    			add_location(path2, file$7, 21, 1070, 1673);
    			attr_dev(path3, "d", "M22.0508 15.2575V23.9924H25.8428C25.8428 23.9924 26.9219 23.8813 26.9995 22.6513V11.459L22.0508 15.2575Z");
    			attr_dev(path3, "fill", "#34A853");
    			add_location(path3, file$7, 21, 1216, 1819);
    			attr_dev(path4, "d", "M9.94811 24.0001V15.0732L9.94043 15.0669L9.94811 24.0001Z");
    			attr_dev(path4, "fill", "#C5221F");
    			add_location(path4, file$7, 21, 1354, 1957);
    			attr_dev(path5, "d", "M9.94014 8.52404L8.37646 7.39382C5.60179 5.91001 5 9.17692 5 9.17692V11.4651L9.94014 15.0667V8.52404Z");
    			attr_dev(path5, "fill", "#C5221F");
    			add_location(path5, file$7, 21, 1445, 2048);
    			attr_dev(path6, "d", "M9.94043 8.52441V15.0671L9.94811 15.0734V8.53073L9.94043 8.52441Z");
    			attr_dev(path6, "fill", "#C5221F");
    			add_location(path6, file$7, 21, 1580, 2183);
    			attr_dev(path7, "d", "M5 11.4668V22.6591C5.07646 23.8904 6.15673 24.0003 6.15673 24.0003H9.94877L9.94014 15.0671L5 11.4668Z");
    			attr_dev(path7, "fill", "#4285F4");
    			add_location(path7, file$7, 21, 1679, 2282);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$7, 21, 349, 952);
    			attr_dev(svg0, "width", "1.96rem");
    			attr_dev(svg0, "height", "1.96rem");
    			attr_dev(svg0, "viewBox", "0 0 32.00 32.00");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$7, 21, 11, 614);
    			attr_dev(a0, "class", "margin-custom");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "aria-label", "gmail");
    			attr_dev(a0, "href", "mailto:suyashjawale245@gmail.com");
    			add_location(a0, file$7, 20, 8, 501);
    			attr_dev(rect1, "x", "-1.6");
    			attr_dev(rect1, "y", "-1.6");
    			attr_dev(rect1, "width", "35.20");
    			attr_dev(rect1, "height", "35.20");
    			attr_dev(rect1, "rx", "7.04");
    			attr_dev(rect1, "fill", "#ffffff");
    			attr_dev(rect1, "strokewidth", "0");
    			add_location(rect1, file$7, 25, 173, 2767);
    			attr_dev(g3, "id", "SVGRepo_bgCarrier");
    			attr_dev(g3, "stroke-width", "0");
    			add_location(g3, file$7, 25, 129, 2723);
    			attr_dev(g4, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g4, "stroke-linecap", "round");
    			attr_dev(g4, "stroke-linejoin", "round");
    			add_location(g4, file$7, 25, 280, 2874);
    			attr_dev(rect2, "x", "2");
    			attr_dev(rect2, "y", "2");
    			attr_dev(rect2, "width", "28");
    			attr_dev(rect2, "height", "28");
    			attr_dev(rect2, "rx", "6");
    			attr_dev(rect2, "fill", "url(#paint0_radial_87_7153)");
    			add_location(rect2, file$7, 25, 391, 2985);
    			attr_dev(rect3, "x", "2");
    			attr_dev(rect3, "y", "2");
    			attr_dev(rect3, "width", "28");
    			attr_dev(rect3, "height", "28");
    			attr_dev(rect3, "rx", "6");
    			attr_dev(rect3, "fill", "url(#paint1_radial_87_7153)");
    			add_location(rect3, file$7, 25, 482, 3076);
    			attr_dev(rect4, "x", "2");
    			attr_dev(rect4, "y", "2");
    			attr_dev(rect4, "width", "28");
    			attr_dev(rect4, "height", "28");
    			attr_dev(rect4, "rx", "6");
    			attr_dev(rect4, "fill", "url(#paint2_radial_87_7153)");
    			add_location(rect4, file$7, 25, 573, 3167);
    			attr_dev(path8, "d", "M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z");
    			attr_dev(path8, "fill", "white");
    			add_location(path8, file$7, 25, 664, 3258);
    			attr_dev(path9, "fill-rule", "evenodd");
    			attr_dev(path9, "clip-rule", "evenodd");
    			attr_dev(path9, "d", "M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z");
    			attr_dev(path9, "fill", "white");
    			add_location(path9, file$7, 25, 822, 3416);
    			attr_dev(path10, "fill-rule", "evenodd");
    			attr_dev(path10, "clip-rule", "evenodd");
    			attr_dev(path10, "d", "M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z");
    			attr_dev(path10, "fill", "white");
    			add_location(path10, file$7, 25, 1132, 3726);
    			attr_dev(stop0, "stop-color", "#B13589");
    			add_location(stop0, file$7, 25, 2743, 5337);
    			attr_dev(stop1, "offset", "0.79309");
    			attr_dev(stop1, "stop-color", "#C62F94");
    			add_location(stop1, file$7, 25, 2778, 5372);
    			attr_dev(stop2, "offset", "1");
    			attr_dev(stop2, "stop-color", "#8A3AC8");
    			add_location(stop2, file$7, 25, 2830, 5424);
    			attr_dev(radialGradient0, "id", "paint0_radial_87_7153");
    			attr_dev(radialGradient0, "cx", "0");
    			attr_dev(radialGradient0, "cy", "0");
    			attr_dev(radialGradient0, "r", "1");
    			attr_dev(radialGradient0, "gradientUnits", "userSpaceOnUse");
    			attr_dev(radialGradient0, "gradientTransform", "translate(12 23) rotate(-55.3758) scale(25.5196)");
    			add_location(radialGradient0, file$7, 25, 2579, 5173);
    			attr_dev(stop3, "stop-color", "#E0E8B7");
    			add_location(stop3, file$7, 25, 3058, 5652);
    			attr_dev(stop4, "offset", "0.444662");
    			attr_dev(stop4, "stop-color", "#FB8A2E");
    			add_location(stop4, file$7, 25, 3093, 5687);
    			attr_dev(stop5, "offset", "0.71474");
    			attr_dev(stop5, "stop-color", "#E2425C");
    			add_location(stop5, file$7, 25, 3146, 5740);
    			attr_dev(stop6, "offset", "1");
    			attr_dev(stop6, "stop-color", "#E2425C");
    			attr_dev(stop6, "stop-opacity", "0");
    			add_location(stop6, file$7, 25, 3198, 5792);
    			attr_dev(radialGradient1, "id", "paint1_radial_87_7153");
    			attr_dev(radialGradient1, "cx", "0");
    			attr_dev(radialGradient1, "cy", "0");
    			attr_dev(radialGradient1, "r", "1");
    			attr_dev(radialGradient1, "gradientUnits", "userSpaceOnUse");
    			attr_dev(radialGradient1, "gradientTransform", "translate(11 31) rotate(-65.1363) scale(22.5942)");
    			add_location(radialGradient1, file$7, 25, 2894, 5488);
    			attr_dev(stop7, "offset", "0.156701");
    			attr_dev(stop7, "stop-color", "#406ADC");
    			add_location(stop7, file$7, 25, 3455, 6049);
    			attr_dev(stop8, "offset", "0.467799");
    			attr_dev(stop8, "stop-color", "#6A45BE");
    			add_location(stop8, file$7, 25, 3508, 6102);
    			attr_dev(stop9, "offset", "1");
    			attr_dev(stop9, "stop-color", "#6A45BE");
    			attr_dev(stop9, "stop-opacity", "0");
    			add_location(stop9, file$7, 25, 3561, 6155);
    			attr_dev(radialGradient2, "id", "paint2_radial_87_7153");
    			attr_dev(radialGradient2, "cx", "0");
    			attr_dev(radialGradient2, "cy", "0");
    			attr_dev(radialGradient2, "r", "1");
    			attr_dev(radialGradient2, "gradientUnits", "userSpaceOnUse");
    			attr_dev(radialGradient2, "gradientTransform", "translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)");
    			add_location(radialGradient2, file$7, 25, 3279, 5873);
    			add_location(defs0, file$7, 25, 2572, 5166);
    			attr_dev(g5, "id", "SVGRepo_iconCarrier");
    			add_location(g5, file$7, 25, 362, 2956);
    			attr_dev(svg1, "width", "1.96rem");
    			attr_dev(svg1, "height", "1.96rem");
    			attr_dev(svg1, "viewBox", "-1.6 -1.6 35.20 35.20");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$7, 25, 11, 2605);
    			attr_dev(a1, "class", "margin-custom");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "aria-label", "instagram");
    			attr_dev(a1, "rel", "noreferrer");
    			attr_dev(a1, "href", "https://www.instagram.com/suyash.jawale/");
    			add_location(a1, file$7, 24, 8, 2463);
    			attr_dev(rect5, "x", "-1.6");
    			attr_dev(rect5, "y", "-1.6");
    			attr_dev(rect5, "width", "19.20");
    			attr_dev(rect5, "height", "19.20");
    			attr_dev(rect5, "rx", "3.84");
    			attr_dev(rect5, "fill", "#ffffff");
    			attr_dev(rect5, "strokewidth", "0");
    			add_location(rect5, file$7, 29, 173, 6594);
    			attr_dev(g6, "id", "SVGRepo_bgCarrier");
    			attr_dev(g6, "stroke-width", "0");
    			add_location(g6, file$7, 29, 129, 6550);
    			attr_dev(g7, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g7, "stroke-linecap", "round");
    			attr_dev(g7, "stroke-linejoin", "round");
    			add_location(g7, file$7, 29, 280, 6701);
    			attr_dev(path11, "fill", "#0A66C2");
    			attr_dev(path11, "d", "M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z");
    			add_location(path11, file$7, 29, 391, 6812);
    			attr_dev(g8, "id", "SVGRepo_iconCarrier");
    			add_location(g8, file$7, 29, 362, 6783);
    			attr_dev(svg2, "width", "1.96rem");
    			attr_dev(svg2, "height", "1.96rem");
    			attr_dev(svg2, "viewBox", "-1.6 -1.6 19.20 19.20");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "fill", "none");
    			add_location(svg2, file$7, 29, 11, 6432);
    			attr_dev(a2, "class", "margin-custom");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "aria-label", "linkedin");
    			attr_dev(a2, "rel", "noreferrer");
    			attr_dev(a2, "href", "https://www.linkedin.com/in/suyashjawale/");
    			add_location(a2, file$7, 28, 8, 6290);
    			attr_dev(g9, "id", "SVGRepo_bgCarrier");
    			attr_dev(g9, "stroke-width", "0");
    			add_location(g9, file$7, 33, 177, 7659);
    			attr_dev(g10, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g10, "stroke-linecap", "round");
    			attr_dev(g10, "stroke-linejoin", "round");
    			add_location(g10, file$7, 33, 225, 7707);
    			add_location(title0, file$7, 33, 336, 7818);
    			add_location(desc, file$7, 33, 393, 7875);
    			add_location(defs1, file$7, 33, 427, 7909);
    			attr_dev(rect6, "id", "mask");
    			attr_dev(rect6, "stroke", "#ffffff");
    			attr_dev(rect6, "stroke-width", "2");
    			attr_dev(rect6, "fill", "#ffffff");
    			attr_dev(rect6, "x", "-1");
    			attr_dev(rect6, "y", "-1");
    			attr_dev(rect6, "width", "71");
    			attr_dev(rect6, "height", "71");
    			attr_dev(rect6, "rx", "14");
    			add_location(rect6, file$7, 33, 637, 8119);
    			attr_dev(path12, "d", "M58.3067362,21.4281798 C55.895743,17.2972267 52.6253846,14.0267453 48.4948004,11.615998 C44.3636013,9.20512774 39.8535636,8 34.9614901,8 C30.0700314,8 25.5585181,9.20549662 21.4281798,11.615998 C17.2972267,14.0266224 14.0269912,17.2972267 11.615998,21.4281798 C9.20537366,25.5590099 8,30.0699084 8,34.9607523 C8,40.8357654 9.71405782,46.1187277 13.1430342,50.8109917 C16.5716416,55.5036246 21.0008949,58.7507436 26.4304251,60.5527176 C27.0624378,60.6700211 27.5302994,60.5875152 27.8345016,60.3072901 C28.1388268,60.0266961 28.290805,59.6752774 28.290805,59.2545094 C28.290805,59.1842994 28.2847799,58.5526556 28.2730988,57.3588401 C28.2610487,56.1650247 28.2553926,55.1235563 28.2553926,54.2349267 L27.4479164,54.3746089 C26.9330843,54.468919 26.2836113,54.5088809 25.4994975,54.4975686 C24.7157525,54.4866252 23.9021284,54.4044881 23.0597317,54.2517722 C22.2169661,54.1004088 21.4330982,53.749359 20.7075131,53.1993604 C19.982297,52.6493618 19.4674649,51.9294329 19.1631397,51.0406804 L18.8120898,50.2328353 C18.5780976,49.6950097 18.2097104,49.0975487 17.7064365,48.4426655 C17.2031625,47.7871675 16.6942324,47.3427912 16.1794003,47.108799 L15.9336039,46.9328437 C15.7698216,46.815909 15.6178435,46.6748743 15.4773006,46.511215 C15.3368806,46.3475556 15.2317501,46.1837734 15.1615401,46.0197452 C15.0912072,45.855594 15.1494901,45.7209532 15.3370036,45.6153308 C15.5245171,45.5097084 15.8633939,45.4584343 16.3551097,45.4584343 L17.0569635,45.5633189 C17.5250709,45.6571371 18.104088,45.9373622 18.7947525,46.4057156 C19.4850481,46.8737001 20.052507,47.4821045 20.4972521,48.230683 C21.0358155,49.1905062 21.6846737,49.9218703 22.4456711,50.4251443 C23.2060537,50.9284182 23.9727072,51.1796248 24.744894,51.1796248 C25.5170807,51.1796248 26.1840139,51.121096 26.7459396,51.0046532 C27.3072505,50.8875956 27.8338868,50.7116403 28.3256025,50.477771 C28.5362325,48.9090515 29.1097164,47.7039238 30.0455624,46.8615271 C28.7116959,46.721353 27.5124702,46.5102313 26.4472706,46.2295144 C25.3826858,45.9484285 24.2825656,45.4922482 23.1476478,44.8597436 C22.0121153,44.2280998 21.0701212,43.44374 20.3214198,42.5080169 C19.5725954,41.571802 18.9580429,40.3426971 18.4786232,38.821809 C17.9989575,37.300306 17.7590632,35.5451796 17.7590632,33.5559381 C17.7590632,30.7235621 18.6837199,28.3133066 20.5326645,26.3238191 C19.6665366,24.1944035 19.7483048,21.8072644 20.778215,19.1626478 C21.4569523,18.951772 22.4635002,19.1100211 23.7973667,19.6364115 C25.1314792,20.1630477 26.1082708,20.6141868 26.7287253,20.9882301 C27.3491798,21.3621504 27.8463057,21.6790175 28.2208409,21.9360032 C30.3978419,21.3277217 32.644438,21.0235195 34.9612442,21.0235195 C37.2780503,21.0235195 39.5251383,21.3277217 41.7022622,21.9360032 L43.0362517,21.0938524 C43.9484895,20.5319267 45.0257392,20.0169716 46.2654186,19.5488642 C47.5058357,19.0810026 48.4543466,18.9521409 49.1099676,19.1630167 C50.1627483,21.8077563 50.2565666,24.1947724 49.3901927,26.324188 C51.2390143,28.3136755 52.1640399,30.7245457 52.1640399,33.556307 C52.1640399,35.5455485 51.9232849,37.3062081 51.444357,38.8393922 C50.9648143,40.3728223 50.3449746,41.6006975 49.5845919,42.5256002 C48.8233486,43.4503799 47.8753296,44.2285916 46.7404118,44.8601125 C45.6052481,45.4921252 44.504759,45.9483056 43.4401742,46.2293914 C42.3750975,46.5104772 41.1758719,46.7217219 39.8420054,46.8621419 C41.0585683,47.9149226 41.6669728,49.5767225 41.6669728,51.846804 L41.6669728,59.2535257 C41.6669728,59.6742937 41.8132948,60.0255895 42.1061847,60.3063064 C42.3987058,60.5865315 42.8606653,60.6690374 43.492678,60.5516109 C48.922946,58.7498829 53.3521992,55.5026409 56.7806837,50.810008 C60.2087994,46.117744 61.923472,40.8347817 61.923472,34.9597686 C61.9222424,30.0695396 60.7162539,25.5590099 58.3067362,21.4281798 Z");
    			attr_dev(path12, "id", "Shape");
    			attr_dev(path12, "fill", "#000000");
    			add_location(path12, file$7, 33, 756, 8238);
    			attr_dev(g11, "id", "container");
    			attr_dev(g11, "transform", "translate(2.000000, 2.000000)");
    			attr_dev(g11, "fill-rule", "nonzero");
    			add_location(g11, file$7, 33, 556, 8038);
    			attr_dev(g12, "id", "team-collaboration/version-control/github");
    			attr_dev(g12, "stroke", "none");
    			attr_dev(g12, "stroke-width", "1");
    			attr_dev(g12, "fill", "none");
    			attr_dev(g12, "fill-rule", "evenodd");
    			add_location(g12, file$7, 33, 442, 7924);
    			attr_dev(g13, "id", "SVGRepo_iconCarrier");
    			add_location(g13, file$7, 33, 307, 7789);
    			attr_dev(svg3, "width", "1.96rem");
    			attr_dev(svg3, "height", "1.96rem");
    			attr_dev(svg3, "viewBox", "0 0 73 73");
    			attr_dev(svg3, "version", "1.1");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg3, "fill", "#ffffff");
    			add_location(svg3, file$7, 33, 11, 7493);
    			attr_dev(a3, "class", "margin-custom");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "aria-label", "github");
    			attr_dev(a3, "rel", "noreferrer");
    			attr_dev(a3, "href", "https://github.com/suyashjawale");
    			add_location(a3, file$7, 32, 8, 7363);
    			attr_dev(rect7, "x", "-1.6");
    			attr_dev(rect7, "y", "-1.6");
    			attr_dev(rect7, "width", "35.20");
    			attr_dev(rect7, "height", "35.20");
    			attr_dev(rect7, "rx", "7.04");
    			attr_dev(rect7, "fill", "#ffffff");
    			attr_dev(rect7, "strokewidth", "0");
    			add_location(rect7, file$7, 37, 207, 12420);
    			attr_dev(g14, "id", "SVGRepo_bgCarrier");
    			attr_dev(g14, "stroke-width", "0");
    			add_location(g14, file$7, 37, 163, 12376);
    			attr_dev(g15, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g15, "stroke-linecap", "round");
    			attr_dev(g15, "stroke-linejoin", "round");
    			add_location(g15, file$7, 37, 314, 12527);
    			add_location(title1, file$7, 37, 425, 12638);
    			attr_dev(path13, "d", "M30.955 16c0 3.951-0.661 7.166-1.483 7.166s-1.483-3.215-1.483-7.166 0.661-7.166 1.483-7.166 1.483 3.215 1.483 7.166zM27.167 16c0 4.412-1.882 8.001-4.212 8.001s-4.225-3.589-4.225-8.001 1.894-8.001 4.225-8.001 4.212 3.589 4.212 8.001zM17.919 16c-0.014 4.67-3.803 8.45-8.475 8.45-4.68 0-8.475-3.794-8.475-8.475s3.794-8.475 8.475-8.475c2.351 0 4.479 0.957 6.014 2.504l0.001 0.001c1.521 1.531 2.46 3.641 2.46 5.97 0 0.009 0 0.018-0 0.026v-0.001z");
    			add_location(path13, file$7, 37, 447, 12660);
    			attr_dev(g16, "id", "SVGRepo_iconCarrier");
    			add_location(g16, file$7, 37, 396, 12609);
    			attr_dev(svg4, "fill", "#000000");
    			attr_dev(svg4, "width", "1.96rem");
    			attr_dev(svg4, "height", "1.96rem");
    			attr_dev(svg4, "viewBox", "-1.6 -1.6 35.20 35.20");
    			attr_dev(svg4, "version", "1.1");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "stroke", "#000000");
    			add_location(svg4, file$7, 37, 11, 12224);
    			attr_dev(a4, "class", "margin-custom");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "aria-label", "medium");
    			attr_dev(a4, "rel", "noreferrer");
    			attr_dev(a4, "href", "https://medium.com/@suyashjawale");
    			add_location(a4, file$7, 36, 8, 12093);
    			attr_dev(rect8, "x", "-2.08");
    			attr_dev(rect8, "y", "-2.08");
    			attr_dev(rect8, "width", "20.16");
    			attr_dev(rect8, "height", "20.16");
    			attr_dev(rect8, "rx", "4.032");
    			attr_dev(rect8, "fill", "#ffffff");
    			attr_dev(rect8, "strokewidth", "0");
    			add_location(rect8, file$7, 41, 175, 13460);
    			attr_dev(g17, "id", "SVGRepo_bgCarrier");
    			attr_dev(g17, "stroke-width", "0");
    			add_location(g17, file$7, 41, 131, 13416);
    			attr_dev(g18, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g18, "stroke-linecap", "round");
    			attr_dev(g18, "stroke-linejoin", "round");
    			add_location(g18, file$7, 41, 285, 13570);
    			attr_dev(path14, "fill", "#1D9BF0");
    			attr_dev(path14, "d", "M13.567 5.144c.008.123.008.247.008.371 0 3.796-2.889 8.173-8.172 8.173v-.002A8.131 8.131 0 011 12.398a5.768 5.768 0 004.25-1.19 2.876 2.876 0 01-2.683-1.995c.431.083.875.066 1.297-.05A2.873 2.873 0 011.56 6.348v-.036c.4.222.847.345 1.304.36a2.876 2.876 0 01-.89-3.836 8.152 8.152 0 005.92 3 2.874 2.874 0 014.895-2.619 5.763 5.763 0 001.824-.697 2.883 2.883 0 01-1.262 1.588A5.712 5.712 0 0015 3.656a5.834 5.834 0 01-1.433 1.488z");
    			add_location(path14, file$7, 41, 396, 13681);
    			attr_dev(g19, "id", "SVGRepo_iconCarrier");
    			add_location(g19, file$7, 41, 367, 13652);
    			attr_dev(svg5, "width", "1.96rem");
    			attr_dev(svg5, "height", "1.96rem");
    			attr_dev(svg5, "viewBox", "-2.08 -2.08 20.16 20.16");
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "fill", "none");
    			add_location(svg5, file$7, 41, 11, 13296);
    			attr_dev(a5, "class", "margin-custom");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "aria-label", "twitter");
    			attr_dev(a5, "rel", "noreferrer");
    			attr_dev(a5, "href", "https://twitter.com/the_suyash_");
    			add_location(a5, file$7, 40, 8, 13165);
    			attr_dev(g20, "id", "SVGRepo_bgCarrier");
    			attr_dev(g20, "stroke-width", "0");
    			add_location(g20, file$7, 45, 161, 14499);
    			attr_dev(g21, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g21, "stroke-linecap", "round");
    			attr_dev(g21, "stroke-linejoin", "round");
    			add_location(g21, file$7, 45, 209, 14547);
    			attr_dev(rect9, "width", "512");
    			attr_dev(rect9, "height", "512");
    			attr_dev(rect9, "rx", "15%");
    			attr_dev(rect9, "fill", "#f58025");
    			add_location(rect9, file$7, 45, 320, 14658);
    			attr_dev(path15, "stroke", "#ffffff");
    			attr_dev(path15, "stroke-width", "30");
    			attr_dev(path15, "fill", "none");
    			attr_dev(path15, "d", "M293 89l90 120zm-53 50l115 97zm-41 65l136 64zm-23 69l148 31zm-6 68h150zm-45-44v105h241V297");
    			add_location(path15, file$7, 45, 383, 14721);
    			attr_dev(g22, "id", "SVGRepo_iconCarrier");
    			add_location(g22, file$7, 45, 291, 14629);
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg6, "aria-label", "Stack Overflow");
    			attr_dev(svg6, "role", "img");
    			attr_dev(svg6, "viewBox", "0 0 512 512");
    			attr_dev(svg6, "width", "1.96rem");
    			attr_dev(svg6, "height", "1.96rem");
    			attr_dev(svg6, "fill", "#000000");
    			add_location(svg6, file$7, 45, 11, 14349);
    			attr_dev(a6, "class", "margin-custom");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "aria-label", "stackoverflow");
    			attr_dev(a6, "rel", "noreferrer");
    			attr_dev(a6, "href", "https://stackoverflow.com/users/9807249/suyash-jawale");
    			add_location(a6, file$7, 44, 8, 14190);
    			attr_dev(div2, "class", "fs-4 lh-lg text-center mx-0");
    			add_location(div2, file$7, 19, 5, 450);
    			attr_dev(span, "class", "prevent-select");
    			add_location(span, file$7, 51, 8, 15049);
    			attr_dev(div3, "class", "fs-6 text-white mt-2");
    			attr_dev(div3, "id", "about");
    			add_location(div3, file$7, 49, 5, 14928);
    			attr_dev(div4, "class", "text-center mb-4");
    			add_location(div4, file$7, 11, 0, 239);
    			attr_dev(div5, "class", "fs-2 text-white ms-1 mb-2");
    			add_location(div5, file$7, 63, 0, 15359);
    			attr_dev(h50, "class", "card-title");
    			add_location(h50, file$7, 66, 7, 15518);
    			add_location(div6, file$7, 67, 7, 15563);
    			add_location(div7, file$7, 70, 13, 15703);
    			add_location(div8, file$7, 71, 13, 15747);
    			attr_dev(div9, "class", "d-flex justify-content-between");
    			add_location(div9, file$7, 69, 10, 15644);
    			attr_dev(small0, "class", "fw-light");
    			add_location(small0, file$7, 68, 7, 15608);
    			add_location(hr, file$7, 77, 10, 15907);
    			attr_dev(div10, "class", "my-2");
    			add_location(div10, file$7, 79, 13, 15943);
    			attr_dev(div11, "class", "my-2");
    			add_location(div11, file$7, 83, 13, 16138);
    			attr_dev(div12, "class", "my-2");
    			add_location(div12, file$7, 87, 13, 16351);
    			attr_dev(div13, "class", "my-2");
    			add_location(div13, file$7, 91, 13, 16580);
    			attr_dev(div14, "class", "my-2");
    			add_location(div14, file$7, 95, 13, 16767);
    			attr_dev(div15, "class", "my-2");
    			add_location(div15, file$7, 99, 13, 17000);
    			attr_dev(div16, "class", "my-2");
    			add_location(div16, file$7, 103, 13, 17168);
    			attr_dev(div17, "class", "my-2");
    			add_location(div17, file$7, 107, 13, 17309);
    			add_location(div18, file$7, 78, 10, 15923);
    			attr_dev(div19, "class", "card-text mt-3");
    			add_location(div19, file$7, 76, 7, 15867);
    			attr_dev(div20, "class", "card-body");
    			add_location(div20, file$7, 65, 4, 15486);
    			attr_dev(div21, "class", "card border-primary bg-transparent text-white mb-3");
    			add_location(div21, file$7, 64, 0, 15416);
    			attr_dev(div22, "class", "fs-2 text-white ms-1 mb-2 mt-4");
    			add_location(div22, file$7, 116, 1, 17548);
    			attr_dev(h51, "class", "card-title");
    			add_location(h51, file$7, 119, 6, 17709);
    			add_location(div23, file$7, 120, 6, 17771);
    			attr_dev(small1, "class", "fw-light");
    			add_location(small1, file$7, 121, 11, 17810);
    			add_location(div24, file$7, 121, 6, 17805);
    			attr_dev(div25, "class", "card-text fw-light mt-2");
    			attr_dev(div25, "id", "skills");
    			add_location(div25, file$7, 122, 6, 17877);
    			attr_dev(div26, "class", "card-body");
    			add_location(div26, file$7, 118, 3, 17678);
    			attr_dev(div27, "class", "card border-primary mb-3 bg-transparent text-white");
    			add_location(div27, file$7, 117, 0, 17609);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			mount_component(linearequilibrium, div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div2, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, g0);
    			append_dev(g0, rect0);
    			append_dev(svg0, g1);
    			append_dev(svg0, g2);
    			append_dev(g2, path0);
    			append_dev(g2, path1);
    			append_dev(g2, path2);
    			append_dev(g2, path3);
    			append_dev(g2, path4);
    			append_dev(g2, path5);
    			append_dev(g2, path6);
    			append_dev(g2, path7);
    			append_dev(div2, t3);
    			append_dev(div2, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, g3);
    			append_dev(g3, rect1);
    			append_dev(svg1, g4);
    			append_dev(svg1, g5);
    			append_dev(g5, rect2);
    			append_dev(g5, rect3);
    			append_dev(g5, rect4);
    			append_dev(g5, path8);
    			append_dev(g5, path9);
    			append_dev(g5, path10);
    			append_dev(g5, defs0);
    			append_dev(defs0, radialGradient0);
    			append_dev(radialGradient0, stop0);
    			append_dev(radialGradient0, stop1);
    			append_dev(radialGradient0, stop2);
    			append_dev(defs0, radialGradient1);
    			append_dev(radialGradient1, stop3);
    			append_dev(radialGradient1, stop4);
    			append_dev(radialGradient1, stop5);
    			append_dev(radialGradient1, stop6);
    			append_dev(defs0, radialGradient2);
    			append_dev(radialGradient2, stop7);
    			append_dev(radialGradient2, stop8);
    			append_dev(radialGradient2, stop9);
    			append_dev(div2, t4);
    			append_dev(div2, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, g6);
    			append_dev(g6, rect5);
    			append_dev(svg2, g7);
    			append_dev(svg2, g8);
    			append_dev(g8, path11);
    			append_dev(div2, t5);
    			append_dev(div2, a3);
    			append_dev(a3, svg3);
    			append_dev(svg3, g9);
    			append_dev(svg3, g10);
    			append_dev(svg3, g13);
    			append_dev(g13, title0);
    			append_dev(title0, t6);
    			append_dev(g13, desc);
    			append_dev(desc, t7);
    			append_dev(g13, defs1);
    			append_dev(g13, g12);
    			append_dev(g12, g11);
    			append_dev(g11, rect6);
    			append_dev(g11, path12);
    			append_dev(div2, t8);
    			append_dev(div2, a4);
    			append_dev(a4, svg4);
    			append_dev(svg4, g14);
    			append_dev(g14, rect7);
    			append_dev(svg4, g15);
    			append_dev(svg4, g16);
    			append_dev(g16, title1);
    			append_dev(title1, t9);
    			append_dev(g16, path13);
    			append_dev(div2, t10);
    			append_dev(div2, a5);
    			append_dev(a5, svg5);
    			append_dev(svg5, g17);
    			append_dev(g17, rect8);
    			append_dev(svg5, g18);
    			append_dev(svg5, g19);
    			append_dev(g19, path14);
    			append_dev(div2, t11);
    			append_dev(div2, a6);
    			append_dev(a6, svg6);
    			append_dev(svg6, g20);
    			append_dev(svg6, g21);
    			append_dev(svg6, g22);
    			append_dev(g22, rect9);
    			append_dev(g22, path15);
    			append_dev(div4, t12);
    			append_dev(div4, div3);
    			append_dev(div3, span);
    			if_block.m(span, null);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div5, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div21, anchor);
    			append_dev(div21, div20);
    			append_dev(div20, h50);
    			append_dev(div20, t17);
    			append_dev(div20, div6);
    			append_dev(div20, t19);
    			append_dev(div20, small0);
    			append_dev(small0, div9);
    			append_dev(div9, div7);
    			append_dev(div9, t21);
    			append_dev(div9, div8);
    			append_dev(div8, t22);
    			append_dev(div8, t23);
    			append_dev(div8, t24);
    			append_dev(div8, t25);
    			append_dev(div20, t26);
    			append_dev(div20, div19);
    			append_dev(div19, hr);
    			append_dev(div19, t27);
    			append_dev(div19, div18);
    			append_dev(div18, div10);
    			append_dev(div18, t29);
    			append_dev(div18, div11);
    			append_dev(div18, t31);
    			append_dev(div18, div12);
    			append_dev(div18, t33);
    			append_dev(div18, div13);
    			append_dev(div18, t35);
    			append_dev(div18, div14);
    			append_dev(div18, t37);
    			append_dev(div18, div15);
    			append_dev(div18, t39);
    			append_dev(div18, div16);
    			append_dev(div18, t41);
    			append_dev(div18, div17);
    			insert_dev(target, t43, anchor);
    			insert_dev(target, div22, anchor);
    			insert_dev(target, t45, anchor);
    			insert_dev(target, div27, anchor);
    			append_dev(div27, div26);
    			append_dev(div26, h51);
    			append_dev(div26, t47);
    			append_dev(div26, div23);
    			append_dev(div26, t49);
    			append_dev(div26, div24);
    			append_dev(div24, small1);
    			append_dev(div26, t51);
    			append_dev(div26, div25);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*toggle*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}

    			if ((!current || dirty & /*exp*/ 4) && t22_value !== (t22_value = /*exp*/ ctx[2][0] + "")) set_data_dev(t22, t22_value);
    			if ((!current || dirty & /*exp*/ 4) && t24_value !== (t24_value = /*exp*/ ctx[2][1] + "")) set_data_dev(t24, t24_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linearequilibrium.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linearequilibrium.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(linearequilibrium);
    			if_block.d();
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div21);
    			if (detaching) detach_dev(t43);
    			if (detaching) detach_dev(div22);
    			if (detaching) detach_dev(t45);
    			if (detaching) detach_dev(div27);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let show = true;

    	function toggle() {
    		$$invalidate(3, show = !show);
    	}

    	let { age = [] } = $$props;
    	let { time_remaining = [] } = $$props;
    	let { exp = [] } = $$props;
    	const writable_props = ['age', 'time_remaining', 'exp'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('age' in $$props) $$invalidate(0, age = $$props.age);
    		if ('time_remaining' in $$props) $$invalidate(1, time_remaining = $$props.time_remaining);
    		if ('exp' in $$props) $$invalidate(2, exp = $$props.exp);
    	};

    	$$self.$capture_state = () => ({
    		LinearEquilibrium,
    		show,
    		toggle,
    		age,
    		time_remaining,
    		exp
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(3, show = $$props.show);
    		if ('age' in $$props) $$invalidate(0, age = $$props.age);
    		if ('time_remaining' in $$props) $$invalidate(1, time_remaining = $$props.time_remaining);
    		if ('exp' in $$props) $$invalidate(2, exp = $$props.exp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [age, time_remaining, exp, show, toggle];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { age: 0, time_remaining: 1, exp: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get age() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set age(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time_remaining() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time_remaining(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get exp() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set exp(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\SearchFilter.svelte generated by Svelte v3.56.0 */

    const file$6 = "src\\SearchFilter.svelte";

    function create_fragment$6(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let input;
    	let t1;
    	let button;
    	let span;
    	let small;
    	let t3;
    	let svg;
    	let g0;
    	let g1;
    	let g2;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			button = element("button");
    			span = element("span");
    			small = element("small");
    			small.textContent = "Filters";
    			t3 = space();
    			svg = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			path = svg_element("path");
    			add_location(div0, file$6, 5, 4, 103);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control form-control-sm bg-transparent border-primary rounded-pill me-1 ps-3");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "aria-label", "Recipient's username");
    			add_location(input, file$6, 7, 7, 171);
    			add_location(small, file$6, 10, 13, 573);
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$6, 12, 16, 727);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$6, 13, 16, 792);
    			attr_dev(path, "d", "M4 7H20M6.99994 12H16.9999M10.9999 17H12.9999");
    			attr_dev(path, "stroke", "#ffffff");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$6, 15, 19, 940);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$6, 14, 16, 891);
    			attr_dev(svg, "width", "18px");
    			attr_dev(svg, "height", "18px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$6, 11, 13, 610);
    			attr_dev(span, "class", "px-2");
    			add_location(span, file$6, 9, 10, 539);
    			attr_dev(button, "class", "btn btn-sm btn-primary bg-transparent rounded-pill font-weight-300");
    			attr_dev(button, "data-bs-toggle", "modal");
    			attr_dev(button, "data-bs-target", "#filterModal");
    			add_location(button, file$6, 8, 7, 391);
    			attr_dev(div1, "class", "input-group my-2 searchWidth");
    			add_location(div1, file$6, 6, 4, 120);
    			attr_dev(div2, "class", "d-flex justify-content-between mb-1");
    			add_location(div2, file$6, 4, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*searchTerm*/ ctx[0]);
    			append_dev(div1, t1);
    			append_dev(div1, button);
    			append_dev(button, span);
    			append_dev(span, small);
    			append_dev(span, t3);
    			append_dev(span, svg);
    			append_dev(svg, g0);
    			append_dev(svg, g1);
    			append_dev(svg, g2);
    			append_dev(g2, path);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(input, "input", /*input_handler*/ ctx[1], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchTerm*/ 1 && input.value !== /*searchTerm*/ ctx[0]) {
    				set_input_value(input, /*searchTerm*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchFilter', slots, []);
    	let { searchTerm } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (searchTerm === undefined && !('searchTerm' in $$props || $$self.$$.bound[$$self.$$.props['searchTerm']])) {
    			console.warn("<SearchFilter> was created without expected prop 'searchTerm'");
    		}
    	});

    	const writable_props = ['searchTerm'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchFilter> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		searchTerm = this.value;
    		$$invalidate(0, searchTerm);
    	}

    	$$self.$$set = $$props => {
    		if ('searchTerm' in $$props) $$invalidate(0, searchTerm = $$props.searchTerm);
    	};

    	$$self.$capture_state = () => ({ searchTerm });

    	$$self.$inject_state = $$props => {
    		if ('searchTerm' in $$props) $$invalidate(0, searchTerm = $$props.searchTerm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchTerm, input_handler, input_input_handler];
    }

    class SearchFilter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { searchTerm: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchFilter",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get searchTerm() {
    		throw new Error("<SearchFilter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchTerm(value) {
    		throw new Error("<SearchFilter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Projects.svelte generated by Svelte v3.56.0 */

    const file$5 = "src\\Projects.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (29:13) {#each project_tags as tag}
    function create_each_block_3(ctx) {
    	let span1;
    	let span0;
    	let t0_value = /*tag*/ ctx[12] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = text(" ");
    			attr_dev(span0, "class", "font-size-xsmall align-middle");
    			add_location(span0, file$5, 30, 19, 1271);
    			attr_dev(span1, "class", "px-2 border border-1 border-secondary rounded");
    			add_location(span1, file$5, 29, 16, 1190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    			append_dev(span0, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_tags*/ 32 && t0_value !== (t0_value = /*tag*/ ctx[12] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(29:13) {#each project_tags as tag}",
    		ctx
    	});

    	return block;
    }

    // (43:13) {#each project_languages as project,i}
    function create_each_block_2$1(ctx) {
    	let div;
    	let div_aria_label_value;
    	let div_aria_valuenow_value;
    	let div_aria_valuemax_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "progress-bar " + /*palette*/ ctx[6][/*i*/ ctx[9]]['color-name']);
    			attr_dev(div, "aria-label", div_aria_label_value = /*project*/ ctx[7]['language']);
    			attr_dev(div, "role", "progressbar");
    			set_style(div, "width", /*project*/ ctx[7]['percentage'] + "%");
    			attr_dev(div, "aria-valuenow", div_aria_valuenow_value = /*project*/ ctx[7]['percentage']);
    			attr_dev(div, "aria-valuemin", "0");
    			attr_dev(div, "aria-valuemax", div_aria_valuemax_value = /*project*/ ctx[7]['percentage']);
    			add_location(div, file$5, 43, 16, 1707);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_languages*/ 8 && div_aria_label_value !== (div_aria_label_value = /*project*/ ctx[7]['language'])) {
    				attr_dev(div, "aria-label", div_aria_label_value);
    			}

    			if (dirty & /*project_languages*/ 8) {
    				set_style(div, "width", /*project*/ ctx[7]['percentage'] + "%");
    			}

    			if (dirty & /*project_languages*/ 8 && div_aria_valuenow_value !== (div_aria_valuenow_value = /*project*/ ctx[7]['percentage'])) {
    				attr_dev(div, "aria-valuenow", div_aria_valuenow_value);
    			}

    			if (dirty & /*project_languages*/ 8 && div_aria_valuemax_value !== (div_aria_valuemax_value = /*project*/ ctx[7]['percentage'])) {
    				attr_dev(div, "aria-valuemax", div_aria_valuemax_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(43:13) {#each project_languages as project,i}",
    		ctx
    	});

    	return block;
    }

    // (49:13) {#each project_languages as project,i}
    function create_each_block_1$2(ctx) {
    	let div;
    	let small;
    	let svg;
    	let g0;
    	let g1;
    	let g54;
    	let g53;
    	let rect;
    	let g52;
    	let g2;
    	let g3;
    	let g4;
    	let g5;
    	let g6;
    	let g7;
    	let g8;
    	let g9;
    	let g10;
    	let g11;
    	let g12;
    	let g13;
    	let g14;
    	let g15;
    	let g16;
    	let g17;
    	let g18;
    	let g19;
    	let g20;
    	let g21;
    	let g22;
    	let g23;
    	let g24;
    	let g25;
    	let g26;
    	let g27;
    	let g28;
    	let g29;
    	let g30;
    	let g31;
    	let g32;
    	let g33;
    	let g34;
    	let g35;
    	let circle;
    	let g36;
    	let g37;
    	let g38;
    	let g39;
    	let g42;
    	let g41;
    	let g40;
    	let g43;
    	let g46;
    	let g45;
    	let g44;
    	let g47;
    	let g49;
    	let g48;
    	let g50;
    	let g51;
    	let t0;
    	let span;
    	let t1_value = /*project*/ ctx[7]['language'] + "";
    	let t1;
    	let t2;
    	let t3_value = /*project*/ ctx[7]['percentage'] + "";
    	let t3;
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			small = element("small");
    			svg = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g54 = svg_element("g");
    			g53 = svg_element("g");
    			rect = svg_element("rect");
    			g52 = svg_element("g");
    			g2 = svg_element("g");
    			g3 = svg_element("g");
    			g4 = svg_element("g");
    			g5 = svg_element("g");
    			g6 = svg_element("g");
    			g7 = svg_element("g");
    			g8 = svg_element("g");
    			g9 = svg_element("g");
    			g10 = svg_element("g");
    			g11 = svg_element("g");
    			g12 = svg_element("g");
    			g13 = svg_element("g");
    			g14 = svg_element("g");
    			g15 = svg_element("g");
    			g16 = svg_element("g");
    			g17 = svg_element("g");
    			g18 = svg_element("g");
    			g19 = svg_element("g");
    			g20 = svg_element("g");
    			g21 = svg_element("g");
    			g22 = svg_element("g");
    			g23 = svg_element("g");
    			g24 = svg_element("g");
    			g25 = svg_element("g");
    			g26 = svg_element("g");
    			g27 = svg_element("g");
    			g28 = svg_element("g");
    			g29 = svg_element("g");
    			g30 = svg_element("g");
    			g31 = svg_element("g");
    			g32 = svg_element("g");
    			g33 = svg_element("g");
    			g34 = svg_element("g");
    			g35 = svg_element("g");
    			circle = svg_element("circle");
    			g36 = svg_element("g");
    			g37 = svg_element("g");
    			g38 = svg_element("g");
    			g39 = svg_element("g");
    			g42 = svg_element("g");
    			g41 = svg_element("g");
    			g40 = svg_element("g");
    			g43 = svg_element("g");
    			g46 = svg_element("g");
    			g45 = svg_element("g");
    			g44 = svg_element("g");
    			g47 = svg_element("g");
    			g49 = svg_element("g");
    			g48 = svg_element("g");
    			g50 = svg_element("g");
    			g51 = svg_element("g");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = text("%");
    			t5 = space();
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$5, 51, 335, 2497);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$5, 51, 382, 2544);
    			attr_dev(rect, "id", "Icons");
    			attr_dev(rect, "x", "0");
    			attr_dev(rect, "y", "0");
    			attr_dev(rect, "width", "1280");
    			attr_dev(rect, "height", "800");
    			set_style(rect, "fill", "none");
    			add_location(rect, file$5, 51, 534, 2696);
    			attr_dev(g2, "id", "Strike");
    			add_location(g2, file$5, 51, 649, 2811);
    			attr_dev(g3, "id", "H1");
    			add_location(g3, file$5, 51, 670, 2832);
    			attr_dev(g4, "id", "H2");
    			add_location(g4, file$5, 51, 687, 2849);
    			attr_dev(g5, "id", "H3");
    			add_location(g5, file$5, 51, 704, 2866);
    			attr_dev(g6, "id", "list-ul");
    			add_location(g6, file$5, 51, 721, 2883);
    			attr_dev(g7, "id", "hamburger-1");
    			add_location(g7, file$5, 51, 743, 2905);
    			attr_dev(g8, "id", "hamburger-2");
    			add_location(g8, file$5, 51, 769, 2931);
    			attr_dev(g9, "id", "list-ol");
    			add_location(g9, file$5, 51, 795, 2957);
    			attr_dev(g10, "id", "list-task");
    			add_location(g10, file$5, 51, 817, 2979);
    			attr_dev(g11, "id", "trash");
    			add_location(g11, file$5, 51, 841, 3003);
    			attr_dev(g12, "id", "vertical-menu");
    			add_location(g12, file$5, 51, 861, 3023);
    			attr_dev(g13, "id", "horizontal-menu");
    			add_location(g13, file$5, 51, 889, 3051);
    			attr_dev(g14, "id", "sidebar-2");
    			add_location(g14, file$5, 51, 919, 3081);
    			attr_dev(g15, "id", "Pen");
    			add_location(g15, file$5, 51, 943, 3105);
    			attr_dev(g16, "id", "Pen1");
    			attr_dev(g16, "serif:id", "Pen");
    			add_location(g16, file$5, 51, 961, 3123);
    			attr_dev(g17, "id", "clock");
    			add_location(g17, file$5, 51, 995, 3157);
    			attr_dev(g18, "id", "external-link");
    			add_location(g18, file$5, 51, 1015, 3177);
    			attr_dev(g19, "id", "hr");
    			add_location(g19, file$5, 51, 1043, 3205);
    			attr_dev(g20, "id", "info");
    			add_location(g20, file$5, 51, 1060, 3222);
    			attr_dev(g21, "id", "warning");
    			add_location(g21, file$5, 51, 1079, 3241);
    			attr_dev(g22, "id", "plus-circle");
    			add_location(g22, file$5, 51, 1101, 3263);
    			attr_dev(g23, "id", "minus-circle");
    			add_location(g23, file$5, 51, 1127, 3289);
    			attr_dev(g24, "id", "vue");
    			add_location(g24, file$5, 51, 1154, 3316);
    			attr_dev(g25, "id", "cog");
    			add_location(g25, file$5, 51, 1172, 3334);
    			attr_dev(g26, "id", "logo");
    			add_location(g26, file$5, 51, 1190, 3352);
    			attr_dev(g27, "id", "radio-check");
    			add_location(g27, file$5, 51, 1209, 3371);
    			attr_dev(g28, "id", "eye-slash");
    			add_location(g28, file$5, 51, 1235, 3397);
    			attr_dev(g29, "id", "eye");
    			add_location(g29, file$5, 51, 1259, 3421);
    			attr_dev(g30, "id", "toggle-off");
    			add_location(g30, file$5, 51, 1277, 3439);
    			attr_dev(g31, "id", "shredder");
    			add_location(g31, file$5, 51, 1302, 3464);
    			attr_dev(g32, "id", "spinner--loading--dots-");
    			attr_dev(g32, "serif:id", "spinner [loading, dots]");
    			add_location(g32, file$5, 51, 1325, 3487);
    			attr_dev(g33, "id", "react");
    			add_location(g33, file$5, 51, 1398, 3560);
    			attr_dev(g34, "id", "check-selected");
    			add_location(g34, file$5, 51, 1418, 3580);
    			attr_dev(circle, "cx", "543.992");
    			attr_dev(circle, "cy", "352");
    			attr_dev(circle, "r", "14.13");
    			add_location(circle, file$5, 51, 1528, 3690);
    			attr_dev(g35, "id", "circle-filled");
    			attr_dev(g35, "transform", "matrix(1.70002,0,0,1.70002,-316.778,-246.387)");
    			add_location(g35, file$5, 51, 1447, 3609);
    			attr_dev(g36, "id", "turn-off");
    			add_location(g36, file$5, 51, 1583, 3745);
    			attr_dev(g37, "id", "code-block");
    			add_location(g37, file$5, 51, 1606, 3768);
    			attr_dev(g38, "id", "user");
    			add_location(g38, file$5, 51, 1631, 3793);
    			attr_dev(g39, "id", "coffee-bean");
    			add_location(g39, file$5, 51, 1650, 3812);
    			attr_dev(g40, "id", "coffee-bean1");
    			attr_dev(g40, "serif:id", "coffee-bean");
    			add_location(g40, file$5, 51, 1776, 3938);
    			attr_dev(g41, "id", "coffee-beans");
    			add_location(g41, file$5, 51, 1754, 3916);
    			attr_dev(g42, "transform", "matrix(0.638317,0.368532,-0.368532,0.638317,785.021,-208.975)");
    			add_location(g42, file$5, 51, 1676, 3838);
    			attr_dev(g43, "id", "coffee-bean-filled");
    			add_location(g43, file$5, 51, 1836, 3998);
    			attr_dev(g44, "id", "coffee-bean2");
    			attr_dev(g44, "serif:id", "coffee-bean");
    			add_location(g44, file$5, 51, 1976, 4138);
    			attr_dev(g45, "id", "coffee-beans-filled");
    			add_location(g45, file$5, 51, 1947, 4109);
    			attr_dev(g46, "transform", "matrix(0.638317,0.368532,-0.368532,0.638317,913.062,-208.975)");
    			add_location(g46, file$5, 51, 1869, 4031);
    			attr_dev(g47, "id", "clipboard");
    			add_location(g47, file$5, 51, 2036, 4198);
    			attr_dev(g48, "id", "clipboard-paste");
    			add_location(g48, file$5, 51, 2108, 4270);
    			attr_dev(g49, "transform", "matrix(1,0,0,1,128.011,1.35415)");
    			add_location(g49, file$5, 51, 2060, 4222);
    			attr_dev(g50, "id", "clipboard-copy");
    			add_location(g50, file$5, 51, 2143, 4305);
    			attr_dev(g51, "id", "Layer1");
    			add_location(g51, file$5, 51, 2172, 4334);
    			attr_dev(g52, "id", "Icons1");
    			attr_dev(g52, "serif:id", "Icons");
    			add_location(g52, file$5, 51, 616, 2778);
    			attr_dev(g53, "transform", "matrix(1,0,0,1,-576,-320)");
    			add_location(g53, file$5, 51, 492, 2654);
    			attr_dev(g54, "id", "SVGRepo_iconCarrier");
    			add_location(g54, file$5, 51, 463, 2625);
    			attr_dev(svg, "fill", /*palette*/ ctx[6][/*i*/ ctx[9]]['color']);
    			attr_dev(svg, "width", "20px");
    			attr_dev(svg, "height", "20px");
    			attr_dev(svg, "viewBox", "0 0 64 64");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "xml:space", "preserve");
    			attr_dev(svg, "xmlns:serif", "http://www.serif.com/");
    			set_style(svg, "fill-rule", "evenodd");
    			set_style(svg, "clip-rule", "evenodd");
    			set_style(svg, "stroke-linejoin", "round");
    			set_style(svg, "stroke-miterlimit", "2");
    			add_location(svg, file$5, 51, 20, 2182);
    			attr_dev(span, "class", "align-bottom");
    			add_location(span, file$5, 52, 20, 4397);
    			add_location(small, file$5, 50, 17, 2153);
    			attr_dev(div, "class", "my-1 me-2");
    			add_location(div, file$5, 49, 13, 2111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, small);
    			append_dev(small, svg);
    			append_dev(svg, g0);
    			append_dev(svg, g1);
    			append_dev(svg, g54);
    			append_dev(g54, g53);
    			append_dev(g53, rect);
    			append_dev(g53, g52);
    			append_dev(g52, g2);
    			append_dev(g52, g3);
    			append_dev(g52, g4);
    			append_dev(g52, g5);
    			append_dev(g52, g6);
    			append_dev(g52, g7);
    			append_dev(g52, g8);
    			append_dev(g52, g9);
    			append_dev(g52, g10);
    			append_dev(g52, g11);
    			append_dev(g52, g12);
    			append_dev(g52, g13);
    			append_dev(g52, g14);
    			append_dev(g52, g15);
    			append_dev(g52, g16);
    			append_dev(g52, g17);
    			append_dev(g52, g18);
    			append_dev(g52, g19);
    			append_dev(g52, g20);
    			append_dev(g52, g21);
    			append_dev(g52, g22);
    			append_dev(g52, g23);
    			append_dev(g52, g24);
    			append_dev(g52, g25);
    			append_dev(g52, g26);
    			append_dev(g52, g27);
    			append_dev(g52, g28);
    			append_dev(g52, g29);
    			append_dev(g52, g30);
    			append_dev(g52, g31);
    			append_dev(g52, g32);
    			append_dev(g52, g33);
    			append_dev(g52, g34);
    			append_dev(g52, g35);
    			append_dev(g35, circle);
    			append_dev(g52, g36);
    			append_dev(g52, g37);
    			append_dev(g52, g38);
    			append_dev(g52, g39);
    			append_dev(g52, g42);
    			append_dev(g42, g41);
    			append_dev(g41, g40);
    			append_dev(g52, g43);
    			append_dev(g52, g46);
    			append_dev(g46, g45);
    			append_dev(g45, g44);
    			append_dev(g52, g47);
    			append_dev(g52, g49);
    			append_dev(g49, g48);
    			append_dev(g52, g50);
    			append_dev(g52, g51);
    			append_dev(small, t0);
    			append_dev(small, span);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			append_dev(div, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_languages*/ 8 && t1_value !== (t1_value = /*project*/ ctx[7]['language'] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*project_languages*/ 8 && t3_value !== (t3_value = /*project*/ ctx[7]['percentage'] + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(49:13) {#each project_languages as project,i}",
    		ctx
    	});

    	return block;
    }

    // (61:13) {#each project_links as project,i}
    function create_each_block$4(ctx) {
    	let div;
    	let a;
    	let small;
    	let t0_value = /*project*/ ctx[7]['name'] + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			small = element("small");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(small, "class", "px-2");
    			add_location(small, file$5, 63, 19, 4923);
    			attr_dev(a, "type", "button");
    			attr_dev(a, "role", "button");
    			attr_dev(a, "class", "btn btn-sm btn-outline-primary rounded-pill text-white font-weight-300");
    			attr_dev(a, "href", a_href_value = /*project*/ ctx[7]['link']);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noreferrer");
    			add_location(a, file$5, 62, 16, 4736);
    			attr_dev(div, "class", "my-1 me-2");
    			add_location(div, file$5, 61, 13, 4695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, small);
    			append_dev(small, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_links*/ 16 && t0_value !== (t0_value = /*project*/ ctx[7]['name'] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*project_links*/ 16 && a_href_value !== (a_href_value = /*project*/ ctx[7]['link'])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(61:13) {#each project_links as project,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div9;
    	let div0;
    	let t0;
    	let t1;
    	let div8;
    	let div3;
    	let div1;
    	let iframe;
    	let iframe_src_value;
    	let t2;
    	let div2;
    	let t3;
    	let div7;
    	let p;
    	let t4;
    	let t5;
    	let div4;
    	let t6;
    	let div5;
    	let t7;
    	let div6;
    	let t8;
    	let hr;
    	let each_value_3 = /*project_tags*/ ctx[5];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*project_languages*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*project_languages*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	let each_value = /*project_links*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			t0 = text(/*project_name*/ ctx[0]);
    			t1 = space();
    			div8 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			iframe = element("iframe");
    			t2 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t3 = space();
    			div7 = element("div");
    			p = element("p");
    			t4 = text(/*project_description*/ ctx[1]);
    			t5 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t6 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			hr = element("hr");
    			attr_dev(div0, "class", "fs-4 my-2");
    			add_location(div0, file$5, 20, 4, 665);
    			attr_dev(iframe, "class", "rounded-3");
    			attr_dev(iframe, "loading", "lazy");
    			if (!src_url_equal(iframe.src, iframe_src_value = /*project_videolink*/ ctx[2])) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "YouTube video player");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$5, 25, 13, 839);
    			attr_dev(div1, "class", "ratio ratio-16x9");
    			add_location(div1, file$5, 24, 10, 794);
    			attr_dev(div2, "class", "mt-2");
    			add_location(div2, file$5, 27, 10, 1112);
    			attr_dev(div3, "class", "col-lg-6 col-md-12 mb-2");
    			add_location(div3, file$5, 23, 8, 745);
    			attr_dev(p, "class", "lh-lg text-justify");
    			add_location(p, file$5, 37, 11, 1472);
    			attr_dev(div4, "class", "progress rounded my-1");
    			set_style(div4, "height", "5px");
    			add_location(div4, file$5, 41, 10, 1580);
    			attr_dev(div5, "class", "d-flex flex-wrap my-2");
    			add_location(div5, file$5, 47, 11, 2008);
    			attr_dev(div6, "class", "d-flex flex-wrap my-2");
    			add_location(div6, file$5, 59, 11, 4596);
    			attr_dev(div7, "class", "col-lg-6 col-md-12");
    			add_location(div7, file$5, 36, 8, 1427);
    			attr_dev(div8, "class", "row");
    			add_location(div8, file$5, 22, 5, 718);
    			attr_dev(div9, "class", "py-2");
    			add_location(div9, file$5, 19, 1, 641);
    			add_location(hr, file$5, 75, 2, 5149);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div0, t0);
    			append_dev(div9, t1);
    			append_dev(div9, div8);
    			append_dev(div8, div3);
    			append_dev(div3, div1);
    			append_dev(div1, iframe);
    			append_dev(div3, t2);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(div2, null);
    				}
    			}

    			append_dev(div8, t3);
    			append_dev(div8, div7);
    			append_dev(div7, p);
    			append_dev(p, t4);
    			append_dev(div7, t5);
    			append_dev(div7, div4);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(div4, null);
    				}
    			}

    			append_dev(div7, t6);
    			append_dev(div7, div5);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(div5, null);
    				}
    			}

    			append_dev(div7, t7);
    			append_dev(div7, div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div6, null);
    				}
    			}

    			insert_dev(target, t8, anchor);
    			insert_dev(target, hr, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*project_name*/ 1) set_data_dev(t0, /*project_name*/ ctx[0]);

    			if (dirty & /*project_videolink*/ 4 && !src_url_equal(iframe.src, iframe_src_value = /*project_videolink*/ ctx[2])) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}

    			if (dirty & /*project_tags*/ 32) {
    				each_value_3 = /*project_tags*/ ctx[5];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if (dirty & /*project_description*/ 2) set_data_dev(t4, /*project_description*/ ctx[1]);

    			if (dirty & /*palette, project_languages*/ 72) {
    				each_value_2 = /*project_languages*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*project_languages, palette*/ 72) {
    				each_value_1 = /*project_languages*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*project_links*/ 16) {
    				each_value = /*project_links*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div6, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	let { project_name } = $$props;
    	let { project_description } = $$props;
    	let { project_videolink } = $$props;
    	let { project_languages } = $$props;
    	let { project_links } = $$props;
    	let { project_tags } = $$props;

    	const palette = [
    		{
    			"color-name": "bg-warning",
    			"color": "#ffc107"
    		},
    		{
    			"color-name": "bg-success",
    			"color": "#198754"
    		},
    		{
    			"color-name": "bg-info",
    			"color": "#0dcaf0"
    		},
    		{
    			"color-name": "bg-danger",
    			"color": "#dc3545"
    		},
    		{
    			"color-name": "bg-primary",
    			"color": "#0d6efd"
    		},
    		{
    			"color-name": "bg-light",
    			"color": "#ffff"
    		},
    		{
    			"color-name": "bg-secondary",
    			"color": "#6c757d"
    		}
    	];

    	$$self.$$.on_mount.push(function () {
    		if (project_name === undefined && !('project_name' in $$props || $$self.$$.bound[$$self.$$.props['project_name']])) {
    			console.warn("<Projects> was created without expected prop 'project_name'");
    		}

    		if (project_description === undefined && !('project_description' in $$props || $$self.$$.bound[$$self.$$.props['project_description']])) {
    			console.warn("<Projects> was created without expected prop 'project_description'");
    		}

    		if (project_videolink === undefined && !('project_videolink' in $$props || $$self.$$.bound[$$self.$$.props['project_videolink']])) {
    			console.warn("<Projects> was created without expected prop 'project_videolink'");
    		}

    		if (project_languages === undefined && !('project_languages' in $$props || $$self.$$.bound[$$self.$$.props['project_languages']])) {
    			console.warn("<Projects> was created without expected prop 'project_languages'");
    		}

    		if (project_links === undefined && !('project_links' in $$props || $$self.$$.bound[$$self.$$.props['project_links']])) {
    			console.warn("<Projects> was created without expected prop 'project_links'");
    		}

    		if (project_tags === undefined && !('project_tags' in $$props || $$self.$$.bound[$$self.$$.props['project_tags']])) {
    			console.warn("<Projects> was created without expected prop 'project_tags'");
    		}
    	});

    	const writable_props = [
    		'project_name',
    		'project_description',
    		'project_videolink',
    		'project_languages',
    		'project_links',
    		'project_tags'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('project_name' in $$props) $$invalidate(0, project_name = $$props.project_name);
    		if ('project_description' in $$props) $$invalidate(1, project_description = $$props.project_description);
    		if ('project_videolink' in $$props) $$invalidate(2, project_videolink = $$props.project_videolink);
    		if ('project_languages' in $$props) $$invalidate(3, project_languages = $$props.project_languages);
    		if ('project_links' in $$props) $$invalidate(4, project_links = $$props.project_links);
    		if ('project_tags' in $$props) $$invalidate(5, project_tags = $$props.project_tags);
    	};

    	$$self.$capture_state = () => ({
    		project_name,
    		project_description,
    		project_videolink,
    		project_languages,
    		project_links,
    		project_tags,
    		palette
    	});

    	$$self.$inject_state = $$props => {
    		if ('project_name' in $$props) $$invalidate(0, project_name = $$props.project_name);
    		if ('project_description' in $$props) $$invalidate(1, project_description = $$props.project_description);
    		if ('project_videolink' in $$props) $$invalidate(2, project_videolink = $$props.project_videolink);
    		if ('project_languages' in $$props) $$invalidate(3, project_languages = $$props.project_languages);
    		if ('project_links' in $$props) $$invalidate(4, project_links = $$props.project_links);
    		if ('project_tags' in $$props) $$invalidate(5, project_tags = $$props.project_tags);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		project_name,
    		project_description,
    		project_videolink,
    		project_languages,
    		project_links,
    		project_tags,
    		palette
    	];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			project_name: 0,
    			project_description: 1,
    			project_videolink: 2,
    			project_languages: 3,
    			project_links: 4,
    			project_tags: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get project_name() {
    		throw new Error("<Projects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project_name(value) {
    		throw new Error("<Projects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get project_description() {
    		throw new Error("<Projects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project_description(value) {
    		throw new Error("<Projects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get project_videolink() {
    		throw new Error("<Projects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project_videolink(value) {
    		throw new Error("<Projects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get project_languages() {
    		throw new Error("<Projects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project_languages(value) {
    		throw new Error("<Projects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get project_links() {
    		throw new Error("<Projects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project_links(value) {
    		throw new Error("<Projects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get project_tags() {
    		throw new Error("<Projects>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project_tags(value) {
    		throw new Error("<Projects>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\NotFound.svelte generated by Svelte v3.56.0 */

    const file$4 = "src\\NotFound.svelte";

    function create_fragment$4(ctx) {
    	let div2;
    	let div0;
    	let svg;
    	let g0;
    	let g1;
    	let g3;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;
    	let path8;
    	let path9;
    	let path10;
    	let path11;
    	let path12;
    	let path13;
    	let path14;
    	let path15;
    	let path16;
    	let path17;
    	let g2;
    	let path18;
    	let path19;
    	let path20;
    	let path21;
    	let path22;
    	let path23;
    	let path24;
    	let path25;
    	let path26;
    	let t0;
    	let div1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g3 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			path10 = svg_element("path");
    			path11 = svg_element("path");
    			path12 = svg_element("path");
    			path13 = svg_element("path");
    			path14 = svg_element("path");
    			path15 = svg_element("path");
    			path16 = svg_element("path");
    			path17 = svg_element("path");
    			g2 = svg_element("g");
    			path18 = svg_element("path");
    			path19 = svg_element("path");
    			path20 = svg_element("path");
    			path21 = svg_element("path");
    			path22 = svg_element("path");
    			path23 = svg_element("path");
    			path24 = svg_element("path");
    			path25 = svg_element("path");
    			path26 = svg_element("path");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "Not Found";
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$4, 2, 112, 155);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$4, 2, 159, 202);
    			attr_dev(path0, "d", "m60.06 48.5a5.82 5.82 0 0 0 -1.08-3c-1.13-1.75-4.17-3.37-7.88-1.42s-2.1 6.05-2.1 6.05a15.13 15.13 0 0 0 -2.34 1.16c-1.6.92-1.66 1.71-1.66 1.71l-1.63-.21v-2.25a15.72 15.72 0 0 0 3.29-.2c.34-.25.29-5.13 0-6s-3.75-3.75-3.75-3.75 0-5.34-.12-5.88-2.69-2.71-2.79-2.79-.19-15.13-.23-17.92-.38-3.83-.88-4.41-4.83-6.42-7-6.59-3.66 1.54-4.58 2.63-4.58 5.66-5 7.12-.62 20.25-.62 20.25a7.68 7.68 0 0 0 -2.69 1.08c-.92.75-.5 8.25-.5 8.25a16.33 16.33 0 0 0 -2 2.5c-.54 1-.46 5.38-.17 5.59a15.46 15.46 0 0 0 2.88.29 10.56 10.56 0 0 0 .12 1.08 6.19 6.19 0 0 0 .61 1.21l-1.09.17a2.54 2.54 0 0 0 -1-1.54 3.59 3.59 0 0 0 -2.2-.84 4.45 4.45 0 0 0 -.59-1 9 9 0 0 0 -2.06-1.46 13.11 13.11 0 0 0 2.21-2.2c.5-.84-.09-3.8-3.25-4.75a7.41 7.41 0 0 0 -7.3 1.87c-1.5 1.42-1.75 5.5-1.75 5.5a19.2 19.2 0 0 0 -1 2.75c-.45 1.63 1.42 4.13 1.42 4.13a5.62 5.62 0 0 0 1.38 3.5c1.37 1.45 4.62.91 4.62.91a9.46 9.46 0 0 0 2 .25 9 9 0 0 0 2.63-.66c.37-.13 1.58 1 3.41 1.29a13 13 0 0 0 4.63-.63c.54-.12.5.09 1.62.46a3.87 3.87 0 0 0 2.63-.46c.46-.12.87.21 1.75.29s1.37-.95 1.5-.91a6.44 6.44 0 0 1 1 1c.25.29.5.2 1-.21a4 4 0 0 0 .98-1.46 2 2 0 0 0 1.58.75c.92-.08 3.38.79 4.58.75a10.41 10.41 0 0 0 2.84-.67c.75-.2 2.41.38 3.25.55a8 8 0 0 0 2.71-.38c1.16-.21 3 .67 5.12.71a4.67 4.67 0 0 0 3.44-1.71 2.61 2.61 0 0 0 1.71.54c1.12 0 3-1 4.2-5.08a5.23 5.23 0 0 0 -1.85-5.96zm-54-7.83c.21.08 2-1.46 4.21-1.79a8.15 8.15 0 0 1 4.67 1.12 5.91 5.91 0 0 0 .54-1.58c-.09-.25-1.71-1.5-5-1.21a8.88 8.88 0 0 0 -5.17 2.08c-.17.17.58 1.29.79 1.38zm42.94 1.62c.21.09 2-1.46 4.21-1.79a8.16 8.16 0 0 1 4.62 1.13 5.66 5.66 0 0 0 .56-1.63c-.08-.25-1.7-1.5-5-1.21a8.92 8.92 0 0 0 -5.16 2.09c-.17.2.58 1.33.77 1.41zm-28.9-15.75c.25-.12 0-8.66 0-8.83s-1.18-.19-1.33 0c-.29.46.13 8.63.25 8.79s.83.17 1.08.04zm23 4.46c.17-.08.38-10 .21-10.46s-1.09-.38-1.29-.08c-.08.12-.25 10.25-.13 10.5s1.05.12 1.21.04z");
    			attr_dev(path0, "fill", "#1d1d1b");
    			add_location(path0, file$4, 2, 269, 312);
    			attr_dev(path1, "d", "m25.31 11.75c-.15-.15 4.13-7 6.08-6.92s6.5 7 6.09 7.17-1.75-1.37-6.21-.83-5.71.83-5.96.58z");
    			attr_dev(path1, "fill", "#e6e4da");
    			add_location(path1, file$4, 2, 2136, 2179);
    			attr_dev(path2, "d", "m27.85 9.67a8.87 8.87 0 0 1 2.25-2.5c.38 0 .79.29.67.54a19.24 19.24 0 0 1 -2.08 2.46c-.13-.04-.84-.29-.84-.5z");
    			attr_dev(path2, "fill", "#1d1d1b");
    			add_location(path2, file$4, 2, 2260, 2303);
    			attr_dev(path3, "d", "m24.27 13.75c.23-.28 1.37-1.25 6-1.33s7.33 1 7.37 1.12.34 19.34.5 19.54 2.59 1.92 2.71 2.42a15.6 15.6 0 0 1 .09 3.33 13.86 13.86 0 0 1 -2.94-2.7c-.58-1-1.46-6.55-1.5-9.84s-.13-9.16-4.79-9.46-5.4 4.17-5.71 8.38-.71 11.33-.88 11.54-5 4.21-5 3.92 0-5.38.42-5.63 2.83-.54 2.88-.91.06-19.42.85-20.38z");
    			attr_dev(path3, "fill", "#696a9b");
    			add_location(path3, file$4, 2, 2403, 2446);
    			attr_dev(path4, "d", "m31.23 18.42c1.21 0 3.71 1.33 3.66 5.91s.25 18.75.25 18.75a9.1 9.1 0 0 0 -2-.87c-.13.12-.59.62-.38.75a11.86 11.86 0 0 1 2.38 1.29c.08.29.2 1.38.08 1.38s-2.38-1.71-2.5-1.55-.46.75-.25.88 2.62 1.46 2.71 1.92.12 1.16.12 1.16-3.12-2.5-3.33-2.25-.58.5-.38.67a37.79 37.79 0 0 1 3.71 2.79 1.46 1.46 0 0 1 -.29.63 39.19 39.19 0 0 0 -3.71-2.55c-.12.13-.58.42-.33.63s2.83 2.25 2.71 2.29-4 .13-5.25 0-1.88-.83-1.92-1.71.46-16.21.71-20.37.17-9.88 4.01-9.75z");
    			attr_dev(path4, "fill", "#cbe7f5");
    			add_location(path4, file$4, 2, 2732, 2775);
    			attr_dev(path5, "d", "m29.35 20.13a2.36 2.36 0 0 1 3.79.25c1.09 1.66.8 5.95.46 6.12s-4.5.42-4.91-.21-.21-5.29.66-6.16z");
    			attr_dev(path5, "fill", "#1d1d1b");
    			add_location(path5, file$4, 2, 3211, 3254);
    			attr_dev(path6, "d", "m31.19 20.29c.79-.05 1.45.71 1.54 2.67s0 2.58-.09 2.58-2.58.29-2.83 0-.5-5.12 1.38-5.25z");
    			attr_dev(path6, "fill", "#ffe19b");
    			add_location(path6, file$4, 2, 3341, 3384);
    			attr_dev(path7, "d", "m35.06 13.46c.42-.05 2.17.58 2.13.83s0 .54-.13.54-2.29-.37-2.29-.62-.04-.71.29-.75z");
    			attr_dev(path7, "fill", "#1d1d1b");
    			add_location(path7, file$4, 2, 3463, 3506);
    			attr_dev(path8, "d", "m35.06 15c.42-.05 2.17.58 2.13.83s0 .55-.13.55-2.29-.38-2.29-.63-.04-.75.29-.75z");
    			attr_dev(path8, "fill", "#1d1d1b");
    			add_location(path8, file$4, 2, 3580, 3623);
    			attr_dev(path9, "d", "m35.81 16.79c.42-.05 1.38.38 1.33.63s0 .54-.12.54-1.5-.17-1.5-.42-.04-.71.29-.75z");
    			attr_dev(path9, "fill", "#1d1d1b");
    			add_location(path9, file$4, 2, 3694, 3737);
    			attr_dev(path10, "d", "m24.69 39.46-.05 7.67s-.58-.92-2.75-.55-2.91 1.3-3 1.63.09 1.46-.08 1.46a7.55 7.55 0 0 1 -.79-.13s-.38-3 0-3.91 5.79-5.75 6.67-6.17z");
    			attr_dev(path10, "fill", "#cbe7f5");
    			add_location(path10, file$4, 2, 3809, 3852);
    			attr_dev(path11, "d", "m37.19 38.71c.19-.17 5.33 4.25 6 4.71s1.45 1.25 1.5 1.71a24.12 24.12 0 0 1 -.09 4c-.16 0-.79-.09-.79-.09s.08-1.71-.12-1.87a6.48 6.48 0 0 0 -3.59-.67 1.94 1.94 0 0 0 -1.79 1.63c0 .25.13 1.37 0 1.37s-1 .08-1 0-.46-10.5-.12-10.79z");
    			attr_dev(path11, "fill", "#cbe7f5");
    			add_location(path11, file$4, 2, 3975, 4018);
    			attr_dev(path12, "d", "m19.94 49.5s-.17-1.08.08-1.29a4.63 4.63 0 0 1 2.37-.58c1.13 0 1.59.2 1.59.45s0 1.59-.13 1.67-3.5-.25-3.91-.25z");
    			attr_dev(path12, "fill", "#85bfe9");
    			add_location(path12, file$4, 2, 4236, 4279);
    			attr_dev(path13, "d", "m39.48 49.25s-.09-1.29.21-1.42a8 8 0 0 1 3 .25 4.58 4.58 0 0 1 0 1.34z");
    			attr_dev(path13, "fill", "#85bfe9");
    			add_location(path13, file$4, 2, 4380, 4423);
    			attr_dev(path14, "d", "m25.19 50.92c.16 0 1 .46 1.29.58a6.47 6.47 0 0 0 .71.25l-.09 1-1.87-.16z");
    			attr_dev(path14, "fill", "#696a9b");
    			add_location(path14, file$4, 2, 4484, 4527);
    			attr_dev(path15, "d", "m35.6 51.79s.92 0 1.25-.46a2.14 2.14 0 0 0 .38-.79l.79.21v1.46h-2.42z");
    			attr_dev(path15, "fill", "#696a9b");
    			add_location(path15, file$4, 2, 4590, 4633);
    			attr_dev(path16, "d", "m39.31 50.25a10.32 10.32 0 0 1 3 .25 12.51 12.51 0 0 1 0 3 9.91 9.91 0 0 0 -1.54 1.33c-.34.46-.13.63-.34.46a4.21 4.21 0 0 1 -1.12-1.54 32.7 32.7 0 0 1 0-3.5z");
    			attr_dev(path16, "fill", "#fab900");
    			add_location(path16, file$4, 2, 4693, 4736);
    			attr_dev(path17, "d", "m20.77 50.71a11.08 11.08 0 0 1 2.12 0c.71 0 1.3.29 1.38.79a5.75 5.75 0 0 1 -.54 2.71c-.38.46-.84 1.08-.88.92a15.21 15.21 0 0 0 -1.66-1.63 1.68 1.68 0 0 1 -.42-.5s-.5-1.79 0-2.29z");
    			attr_dev(path17, "fill", "#fab900");
    			add_location(path17, file$4, 2, 4884, 4927);
    			attr_dev(path18, "d", "m39.89 50.92.5.08.13 2.42s-.67 0-.63-.17 0-2.33 0-2.33z");
    			add_location(path18, file$4, 2, 5115, 5158);
    			attr_dev(path19, "d", "m41 50.79.5.09.12 2.41s-.66 0-.62-.16 0-2.34 0-2.34z");
    			add_location(path19, file$4, 2, 5189, 5232);
    			attr_dev(path20, "d", "m22.69 51.29.5.09.12 2.41s-.67 0-.62-.16 0-2.34 0-2.34z");
    			add_location(path20, file$4, 2, 5260, 5303);
    			attr_dev(path21, "d", "m21.52 51.25c.21 0 .5-.08.54.13s.21 1.54 0 1.54a2.35 2.35 0 0 1 -.62-.17z");
    			add_location(path21, file$4, 2, 5334, 5377);
    			attr_dev(g2, "fill", "#1d1d1b");
    			add_location(g2, file$4, 2, 5096, 5139);
    			attr_dev(path22, "d", "m25 53.58 2 .13a3.52 3.52 0 0 0 .79 3c1.21 1.71 1.75 2 1.71 2.29a1.1 1.1 0 0 1 -.92.75c-.5.08-1.21-.79-2.29-.42a17.32 17.32 0 0 1 -2.17.59 5.18 5.18 0 0 0 -2.66-.63c-1.09.21-2.71 1-4.8.42s-2-1.17-3.2-.84a7.87 7.87 0 0 1 -2.34.42c-.33 0-.58 0-.46-.08a3.87 3.87 0 0 0 .63-1.34c-.08-.12-.33-.54-.46-.33a3.14 3.14 0 0 1 -1.37 1.25c-.63.17-2.8.25-3.88-1.12a3 3 0 0 1 -.27-3.67c.54-.5 1.5-1.08 1.54-1.21s-.62-.58-.62-.58-1.38-.08-1.42.13-.83 2.12-1 2a3.35 3.35 0 0 1 -.81-2.34 7.06 7.06 0 0 1 .62-2.13 2.8 2.8 0 0 0 1.46 1.46c1 .29 1.13.17 1.13.17s-2.34-2-1.84-4.25 1.63-4.37 3.9-4.67 5.5.55 5.42 2.38a4.12 4.12 0 0 1 -2.59 3.25 11.66 11.66 0 0 0 -2.33.37 2.29 2.29 0 0 0 -1.17 1.3 5.58 5.58 0 0 0 1.17.37c.17 0-.13-.87 1.42-.87s3.45.62 3.66 1.79a3.41 3.41 0 0 1 -.54 2.25s.83 1 1.33 1 .92-.71 1.17-1a5.31 5.31 0 0 0 .54-1.29s1.54.7 1.46 1.41-.5 1.21-.42 1.34 1 .54 1.3.29a2.33 2.33 0 0 1 2.58-.17c1 .71 1 1.87 1.21 2s1.41-.54 2-1.79a7.74 7.74 0 0 0 .52-1.63z");
    			attr_dev(path22, "fill", "#e6e4da");
    			add_location(path22, file$4, 2, 5431, 5474);
    			attr_dev(path23, "d", "m28.14 52h1.5a2.7 2.7 0 0 0 0 2.67c.79 1.37 1.54 1.62 1.63 2s2.33-1 2.41-2.38a3.28 3.28 0 0 0 -.37-2l1 .13s1.16 2.66.08 4-3.16 2.25-3.45 2.58-.55-1.12-1.67-2.41a4.48 4.48 0 0 1 -1.13-4.59z");
    			attr_dev(path23, "fill", "#ffe19b");
    			add_location(path23, file$4, 2, 6418, 6461);
    			attr_dev(path24, "d", "m31.23 51.46a1.43 1.43 0 0 1 1.46 2 7.32 7.32 0 0 1 -1.34 2.29 3.57 3.57 0 0 1 -1.12-2.58 2.32 2.32 0 0 1 1-1.71z");
    			attr_dev(path24, "fill", "#fab900");
    			add_location(path24, file$4, 2, 6640, 6683);
    			attr_dev(path25, "d", "m35.85 53.46h1.92a4.92 4.92 0 0 0 1.29 2c1 1 .83 1.63 1.25 1.92s.83.33 1 0a4.08 4.08 0 0 1 .92-2.17 7.8 7.8 0 0 1 1.21-1.21l1.66.29s1 1.42 1.67 1.42a1.57 1.57 0 0 0 1.08-.62s-1.62-.75-1.16-1.88a5.18 5.18 0 0 1 5.2-2.42 5.6 5.6 0 0 1 4.55 4.55 3.7 3.7 0 0 1 -3.09 3.87c-2.16.33-4.58-.83-6.12-.46s-.92.63-2.13.5-1.91-.66-3.12-.62-2.92 1-3.5.87a7.71 7.71 0 0 0 -2.84-.66c-1.12.12-1.66.2-1.66.2s-.84-.33-.79-.45 2.33-1 2.5-2.67.16-2.46.16-2.46z");
    			attr_dev(path25, "fill", "#e6e4da");
    			add_location(path25, file$4, 2, 6787, 6830);
    			attr_dev(path26, "d", "m50.23 49.63a3.32 3.32 0 0 1 .25-3.84c1.41-1.5 4.79-1.79 6.52-.79s2.58 5.46 2.37 6.58a3.11 3.11 0 0 1 -1.12 1.8s.12.58.33.62 1-.58 1.34-1.25a11 11 0 0 0 .45-2.67 3.76 3.76 0 0 1 .75 4.05 9.63 9.63 0 0 1 -2.79 4 4.66 4.66 0 0 1 -1.46.29s2.09-3.17-.29-6a6.88 6.88 0 0 0 -6.35-2.79z");
    			attr_dev(path26, "fill", "#e6e4da");
    			add_location(path26, file$4, 2, 7261, 7304);
    			attr_dev(g3, "id", "SVGRepo_iconCarrier");
    			add_location(g3, file$4, 2, 240, 283);
    			attr_dev(svg, "width", "10rem");
    			attr_dev(svg, "height", "10rem");
    			attr_dev(svg, "viewBox", "0 0 64 64");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#000000");
    			add_location(svg, file$4, 2, 8, 51);
    			add_location(div0, file$4, 1, 4, 36);
    			add_location(div1, file$4, 4, 4, 7645);
    			attr_dev(div2, "class", "text-center my-5");
    			add_location(div2, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, svg);
    			append_dev(svg, g0);
    			append_dev(svg, g1);
    			append_dev(svg, g3);
    			append_dev(g3, path0);
    			append_dev(g3, path1);
    			append_dev(g3, path2);
    			append_dev(g3, path3);
    			append_dev(g3, path4);
    			append_dev(g3, path5);
    			append_dev(g3, path6);
    			append_dev(g3, path7);
    			append_dev(g3, path8);
    			append_dev(g3, path9);
    			append_dev(g3, path10);
    			append_dev(g3, path11);
    			append_dev(g3, path12);
    			append_dev(g3, path13);
    			append_dev(g3, path14);
    			append_dev(g3, path15);
    			append_dev(g3, path16);
    			append_dev(g3, path17);
    			append_dev(g3, g2);
    			append_dev(g2, path18);
    			append_dev(g2, path19);
    			append_dev(g2, path20);
    			append_dev(g2, path21);
    			append_dev(g3, path22);
    			append_dev(g3, path23);
    			append_dev(g3, path24);
    			append_dev(g3, path25);
    			append_dev(g3, path26);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotFound', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const domain_list = [
        {
            "domain": "Languages",
            "children" : ['Rust','Python','PHP','Java','C','C++','Go','Kotlin','Javascript']
        },
        {
            "domain": "Data Science",
            "children" : ['Natural Language Processing','Computer Vision','Predictive Analysis','Transfer Learning']
        },
        {
            "domain": "Backend",
            "children" : ['NodeJS','ExpressJS','Fastify','Flask','Go Fiber','Actix-web']
        },
        {
            "domain": "Databases",
            "children" : ['Redis','MongoDB','MySQL','Postgres','OracleDB','SAP Hana']
        },
        {
            "domain": "Frontend",
            "children" : ['Svelte','JQuery','Bootstrap','HTML5 / Css3']
            
        },
        {
            "domain": "Testing & Automation",
            "children" : ['Selenium','Postman','Thunderclient']
        },
        {
            "domain": "DevOps",
            "children" : ['Git','Docker']
        },
        {
            "domain": "Cloud Services",
            "children" : ['AWS','GCP','Azure','Heroku','Digitalocean']
        }
    ];

    /* src\Skills.svelte generated by Svelte v3.56.0 */
    const file$3 = "src\\Skills.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (16:19) {#each domain['children'] as skill}
    function create_each_block_1$1(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*skill*/ ctx[3] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("•   ");
    			t1 = text(t1_value);
    			attr_dev(div, "class", /*skill*/ ctx[3].length >= 10 ? "col-12" : "col-6");
    			add_location(div, file$3, 16, 22, 727);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(16:19) {#each domain['children'] as skill}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each domain_list as domain}
    function create_each_block$3(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let t0_value = /*domain*/ ctx[0]['domain'] + "";
    	let t0;
    	let t1;
    	let div2;
    	let div1;
    	let t2;
    	let each_value_1 = /*domain*/ ctx[0]['children'];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(div0, "class", "card-header bg-transparent font-weight-500");
    			add_location(div0, file$3, 10, 13, 461);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$3, 14, 16, 630);
    			attr_dev(div2, "class", "card-body");
    			add_location(div2, file$3, 13, 13, 589);
    			attr_dev(div3, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div3, file$3, 9, 10, 371);
    			attr_dev(div4, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div4, file$3, 8, 7, 262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, t0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			append_dev(div4, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*domain_list*/ 0) {
    				each_value_1 = /*domain*/ ctx[0]['children'];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(8:4) {#each domain_list as domain}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let t1;
    	let small;
    	let t3;
    	let div1;
    	let each_value = domain_list;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Skills";
    			t1 = space();
    			small = element("small");
    			small.textContent = "Categorized by domains.";
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "fs-2 text-white ms-1");
    			add_location(div0, file$3, 4, 1, 75);
    			attr_dev(small, "class", "fw-divghter text-white ms-1");
    			add_location(small, file$3, 5, 1, 124);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$3, 6, 1, 201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, small, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*domain_list*/ 0) {
    				each_value = domain_list;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(small);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ domain_list });
    	return [];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    let uid = 1;
    const project_list = [
      {
        id: uid++,
        name: "ModelX",
        videolink: "https://www.youtube.com/embed/nwiqzuOiMeM",
        description:
          "ModelX is an android app used to assign name to the products. A simple way to catalog products. ModelX uses the simple principle of CLICK & EDIT. Just click the product photo, enter the product name and done. Check out the pic in the gallery.",
        languages: [
          {
            language: "Kotlin",
            percentage: "100",
          },
        ],
        links: [
          {
            link: "https://play.google.com/store/apps/details?id=com.tech.modelx",
            name: "Google Play",
          },
        ],
        tags: ["Android"],
      },
      {
        id: uid++,
        name: "InstagramCLI",
        videolink: "https://www.youtube.com/embed/yqWX86uT5jM",
        description:
          "InstagramCLI is the most advanced data mining library made by reverse-engineering the Instagram API calls which has low latency. InstagramCLI can be used as a data-gathering tool for data science and osint practices.",
        languages: [
          {
            language: "Python",
            percentage: "100",
          },
        ],
        links: [
          {
            link: "https://pypi.org/project/InstagramCLI/",
            name: "PyPi",
          },
        ],
        tags: ["Cli"],
      }
    ];

    /* src\Blog.svelte generated by Svelte v3.56.0 */

    const file$2 = "src\\Blog.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (82:4) {#each blogs as blog}
    function create_each_block$2(ctx) {
    	let div2;
    	let div0;
    	let p;
    	let t0_value = /*blog*/ ctx[10].content + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*blog*/ ctx[10].date + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(p, "class", "card-text wrapped");
    			add_location(p, file$2, 84, 16, 2075);
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$2, 83, 12, 2034);
    			attr_dev(div1, "class", "card-footer bg-transparent text-muted text-end font-size-small py-1");
    			add_location(div1, file$2, 88, 12, 2196);
    			attr_dev(div2, "class", "card border-primary mb-4 bg-transparent");
    			add_location(div2, file$2, 82, 8, 1967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blogs*/ 2 && t0_value !== (t0_value = /*blog*/ ctx[10].content + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*blogs*/ 2 && t2_value !== (t2_value = /*blog*/ ctx[10].date + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(82:4) {#each blogs as blog}",
    		ctx
    	});

    	return block;
    }

    // (99:12) {#if avatar}
    function create_if_block$2(ctx) {
    	let button;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			attr_dev(img, "class", "img-fluid rounded border border-2 border-white");
    			if (!src_url_equal(img.src, img_src_value = /*avatar*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			add_location(img, file$2, 101, 20, 2649);
    			attr_dev(button, "class", "btn bg-transparent previewImage my-2");
    			add_location(button, file$2, 99, 16, 2507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*avatar*/ 4 && !src_url_equal(img.src, img_src_value = /*avatar*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(99:12) {#if avatar}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let t2;
    	let div5;
    	let div4;
    	let div3;
    	let t3;
    	let form;
    	let div2;
    	let textarea;
    	let t4;
    	let input;
    	let t5;
    	let button0;
    	let svg0;
    	let g0;
    	let g1;
    	let g2;
    	let path0;
    	let circle;
    	let t6;
    	let button1;
    	let svg1;
    	let g3;
    	let g4;
    	let g5;
    	let path1;
    	let mounted;
    	let dispose;
    	let each_value = /*blogs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let if_block = /*avatar*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Blog";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			if (if_block) if_block.c();
    			t3 = space();
    			form = element("form");
    			div2 = element("div");
    			textarea = element("textarea");
    			t4 = space();
    			input = element("input");
    			t5 = space();
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			path0 = svg_element("path");
    			circle = svg_element("circle");
    			t6 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			g3 = svg_element("g");
    			g4 = svg_element("g");
    			g5 = svg_element("g");
    			path1 = svg_element("path");
    			attr_dev(div0, "class", "fs-2 mb-2 ms-1");
    			add_location(div0, file$2, 80, 4, 1892);
    			attr_dev(div1, "class", "text-white mb-5 pb-3");
    			add_location(div1, file$2, 79, 0, 1852);
    			attr_dev(textarea, "rows", "1");
    			attr_dev(textarea, "id", "thought");
    			attr_dev(textarea, "class", "form-control border-0 bg-transparent shadow-none");
    			attr_dev(textarea, "placeholder", "Something ...");
    			attr_dev(textarea, "aria-label", "blogpost");
    			add_location(textarea, file$2, 107, 20, 2891);
    			set_style(input, "display", "none");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", ".jpg, .jpeg, .png");
    			add_location(input, file$2, 109, 20, 3126);
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$2, 112, 129, 3524);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$2, 112, 176, 3571);
    			attr_dev(path0, "fill", "#ffffff");
    			attr_dev(path0, "d", "M60 50v6a6 6 0 0 0 4.8-2.4L60 50Zm12-16v-6a6 6 0 0 0-4.8 2.4L72 34Zm60 16-4.8 3.6A6 6 0 0 0 132 56v-6Zm-12-16 4.8-3.6A6 6 0 0 0 120 28v6Zm44 32v76h12V66h-12Zm-10 86H38v12h116v-12ZM28 142V66H16v76h12Zm10-86h22V44H38v12Zm26.8-2.4 12-16-9.6-7.2-12 16 9.6 7.2ZM132 56h22V44h-22v12Zm4.8-9.6-12-16-9.6 7.2 12 16 9.6-7.2ZM120 28H72v12h48V28ZM38 152c-5.523 0-10-4.477-10-10H16c0 12.15 9.85 22 22 22v-12Zm126-10c0 5.523-4.477 10-10 10v12c12.15 0 22-9.85 22-22h-12Zm12-76c0-12.15-9.85-22-22-22v12c5.523 0 10 4.477 10 10h12ZM28 66c0-5.523 4.477-10 10-10V44c-12.15 0-22 9.85-22 22h12Z");
    			add_location(path0, file$2, 112, 285, 3680);
    			attr_dev(circle, "cx", "96");
    			attr_dev(circle, "cy", "102");
    			attr_dev(circle, "r", "28");
    			attr_dev(circle, "stroke", "#ffffff");
    			attr_dev(circle, "stroke-width", "12");
    			add_location(circle, file$2, 112, 890, 4285);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$2, 112, 257, 3652);
    			attr_dev(svg0, "width", "1.4rem");
    			attr_dev(svg0, "height", "1.4rem");
    			attr_dev(svg0, "viewBox", "0 0 192 192");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			add_location(svg0, file$2, 112, 24, 3419);
    			attr_dev(button0, "class", "btn sm-padding shadow-none border-0 bg-transparent");
    			add_location(button0, file$2, 111, 20, 3275);
    			attr_dev(g3, "id", "SVGRepo_bgCarrier");
    			attr_dev(g3, "stroke-width", "0");
    			add_location(g3, file$2, 116, 127, 4670);
    			attr_dev(g4, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g4, "stroke-linecap", "round");
    			attr_dev(g4, "stroke-linejoin", "round");
    			add_location(g4, file$2, 116, 174, 4717);
    			attr_dev(path1, "d", "M21.7071 2.29292C21.9787 2.56456 22.0707 2.96779 21.9438 3.33038L15.3605 22.14C14.9117 23.4223 13.1257 23.4951 12.574 22.2537L9.90437 16.2471L17.3676 7.33665C17.7595 6.86875 17.1312 6.24038 16.6633 6.63229L7.75272 14.0956L1.74631 11.426C0.504876 10.8743 0.577721 9.08834 1.85999 8.63954L20.6696 2.05617C21.0322 1.92926 21.4354 2.02128 21.7071 2.29292Z");
    			attr_dev(path1, "fill", "#ffffff");
    			add_location(path1, file$2, 116, 284, 4827);
    			attr_dev(g5, "id", "SVGRepo_iconCarrier");
    			add_location(g5, file$2, 116, 255, 4798);
    			attr_dev(svg1, "width", "1.3rem");
    			attr_dev(svg1, "height", "1.3rem");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$2, 116, 24, 4567);
    			attr_dev(button1, "type", "submit");
    			attr_dev(button1, "class", "btn sm-padding shadow-none border-0 bg-transparent");
    			add_location(button1, file$2, 115, 20, 4426);
    			attr_dev(div2, "class", "input-group");
    			add_location(div2, file$2, 106, 16, 2844);
    			add_location(form, file$2, 105, 12, 2785);
    			attr_dev(div3, "class", "box-color rounded mb-2 py-1");
    			add_location(div3, file$2, 97, 8, 2422);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$2, 95, 4, 2387);
    			attr_dev(div5, "class", "fixed-bottom bg-custom");
    			add_location(div5, file$2, 94, 0, 2345);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, form);
    			append_dev(form, div2);
    			append_dev(div2, textarea);
    			set_input_value(textarea, /*thought*/ ctx[0]);
    			append_dev(div2, t4);
    			append_dev(div2, input);
    			/*input_binding*/ ctx[8](input);
    			append_dev(div2, t5);
    			append_dev(div2, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, g0);
    			append_dev(svg0, g1);
    			append_dev(svg0, g2);
    			append_dev(g2, path0);
    			append_dev(g2, circle);
    			append_dev(div2, t6);
    			append_dev(div2, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, g3);
    			append_dev(svg1, g4);
    			append_dev(svg1, g5);
    			append_dev(g5, path1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", autoResize, false, false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[6]),
    					listen_dev(input, "change", /*change_handler*/ ctx[7], false, false, false, false),
    					listen_dev(button0, "click", prevent_default(/*click_handler*/ ctx[9]), false, true, false, false),
    					listen_dev(button1, "click", prevent_default(/*addPost*/ ctx[4]), false, true, false, false),
    					listen_dev(form, "submit", prevent_default(/*addPost*/ ctx[4]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*blogs*/ 2) {
    				each_value = /*blogs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*avatar*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div3, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*thought*/ 1) {
    				set_input_value(textarea, /*thought*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div5);
    			if (if_block) if_block.d();
    			/*input_binding*/ ctx[8](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const MAX_HEIGHT = 200;

    function resizeTextArea() {
    	let elem = document.getElementById("thought");
    	elem.style.height = "0px";
    }

    function autoResize(event) {
    	const textarea = event.target;
    	textarea.style.height = 'auto';
    	textarea.style.height = `${Math.min(textarea.scrollHeight + 2, MAX_HEIGHT)}px`;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blog', slots, []);
    	let thought = "";

    	let blogs = [
    		{ "content": "ss", "date": "ss" },
    		{ "content": "ss", "date": "ss" },
    		{ "content": "ss", "date": "ss" },
    		{ "content": "ss", "date": "ss" },
    		{ "content": "ss", "date": "ss" },
    		{ "content": "ss", "date": "ss" },
    		{ "content": "ss", "date": "ss" },
    		{ "content": "ss", "date": "ss" }
    	];

    	const addPost = () => {
    		if (thought.trim() !== "") {
    			let password = prompt("Enter password");

    			if (password && password.trim() !== "") {
    				$$invalidate(1, blogs = [
    					{
    						"content": thought.trim(),
    						"date": new Date()
    					},
    					...blogs
    				]);

    				resizeTextArea();
    				$$invalidate(0, thought = "");
    			}
    		}
    	};

    	let avatar, fileinput;

    	const onFileSelected = e => {
    		let image = e.target.files[0];
    		let reader = new FileReader();
    		reader.readAsDataURL(image);

    		reader.onload = e => {
    			$$invalidate(2, avatar = e.target.result);
    		};
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blog> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		thought = this.value;
    		$$invalidate(0, thought);
    	}

    	const change_handler = e => onFileSelected(e);

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileinput = $$value;
    			$$invalidate(3, fileinput);
    		});
    	}

    	const click_handler = () => {
    		fileinput.click();
    	};

    	$$self.$capture_state = () => ({
    		MAX_HEIGHT,
    		thought,
    		blogs,
    		addPost,
    		resizeTextArea,
    		autoResize,
    		avatar,
    		fileinput,
    		onFileSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('thought' in $$props) $$invalidate(0, thought = $$props.thought);
    		if ('blogs' in $$props) $$invalidate(1, blogs = $$props.blogs);
    		if ('avatar' in $$props) $$invalidate(2, avatar = $$props.avatar);
    		if ('fileinput' in $$props) $$invalidate(3, fileinput = $$props.fileinput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		thought,
    		blogs,
    		avatar,
    		fileinput,
    		addPost,
    		onFileSelected,
    		textarea_input_handler,
    		change_handler,
    		input_binding,
    		click_handler
    	];
    }

    class Blog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Collections.svelte generated by Svelte v3.56.0 */
    const file$1 = "src\\Collections.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (39:0) {:else}
    function create_else_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading ...";
    			add_location(div, file$1, 39, 4, 1446);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(39:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if images}
    function create_if_block$1(ctx) {
    	let div;
    	let each_value = /*images*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "row");
    			add_location(div, file$1, 10, 4, 157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*images*/ 1) {
    				each_value = /*images*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:0) {#if images}",
    		ctx
    	});

    	return block;
    }

    // (13:8) {#each images as image}
    function create_each_block$1(ctx) {
    	let div5;
    	let div4;
    	let div3;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div2;
    	let div1;
    	let h5;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let small;
    	let t6;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Card title";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "This is a wider card with supporting text below as a natural\r\n                                    lead-in to additional content. This content is a little bit\r\n                                    longer.";
    			t4 = space();
    			p1 = element("p");
    			small = element("small");
    			small.textContent = "Last updated 3 mins ago";
    			t6 = space();
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = "assets/images/" + /*image*/ ctx[1] + ".jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "img-fluid rounded-start");
    			attr_dev(img, "alt", "...");
    			add_location(img, file$1, 17, 28, 437);
    			attr_dev(div0, "class", "col-md-6");
    			add_location(div0, file$1, 16, 24, 385);
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$1, 21, 32, 700);
    			attr_dev(p0, "class", "card-text");
    			add_location(p0, file$1, 22, 32, 772);
    			attr_dev(small, "class", "text-muted");
    			add_location(small, file$1, 28, 36, 1164);
    			attr_dev(p1, "class", "card-text");
    			add_location(p1, file$1, 27, 32, 1105);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file$1, 20, 28, 643);
    			attr_dev(div2, "class", "col-md-6");
    			add_location(div2, file$1, 19, 24, 591);
    			attr_dev(div3, "class", "row g-0");
    			add_location(div3, file$1, 15, 20, 338);
    			attr_dev(div4, "class", "card my-3 bg-transparent border-primary");
    			add_location(div4, file$1, 14, 16, 263);
    			attr_dev(div5, "class", "col-lg-6");
    			add_location(div5, file$1, 13, 12, 223);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h5);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, small);
    			append_dev(div5, t6);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(13:8) {#each images as image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*images*/ ctx[0]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Collections', slots, []);
    	let images;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Collections> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, images });

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [images];
    }

    class Collections extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Collections",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.56.0 */
    const file = "src\\App.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (150:46) 
    function create_if_block_8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "snippets content goes here";
    			add_location(div, file, 150, 8, 7094);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(150:46) ",
    		ctx
    	});

    	return block;
    }

    // (148:49) 
    function create_if_block_7(ctx) {
    	let collections;
    	let current;
    	collections = new Collections({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(collections.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(collections, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(collections.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(collections.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(collections, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(148:49) ",
    		ctx
    	});

    	return block;
    }

    // (146:42) 
    function create_if_block_6(ctx) {
    	let blog;
    	let current;
    	blog = new Blog({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(blog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(blog, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(blog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(blog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(blog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(146:42) ",
    		ctx
    	});

    	return block;
    }

    // (144:44) 
    function create_if_block_5(ctx) {
    	let skills;
    	let current;
    	skills = new Skills({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(skills.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skills, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skills.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skills.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skills, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(144:44) ",
    		ctx
    	});

    	return block;
    }

    // (70:46) 
    function create_if_block_1(ctx) {
    	let section;
    	let div0;
    	let t1;
    	let searchfilter;
    	let updating_searchTerm;
    	let t2;
    	let t3;
    	let current_block_type_index;
    	let if_block1;
    	let t4;
    	let div12;
    	let div11;
    	let div10;
    	let div9;
    	let div1;
    	let t6;
    	let small0;
    	let div7;
    	let div2;
    	let input0;
    	let t7;
    	let label0;
    	let t9;
    	let div3;
    	let input1;
    	let t10;
    	let label1;
    	let t12;
    	let div4;
    	let input2;
    	let t13;
    	let label2;
    	let t15;
    	let div5;
    	let input3;
    	let t16;
    	let label3;
    	let t18;
    	let div6;
    	let input4;
    	let t19;
    	let label4;
    	let t21;
    	let hr;
    	let t22;
    	let div8;
    	let button0;
    	let small1;
    	let t24;
    	let button1;
    	let small2;
    	let current;
    	let binding_group;
    	let mounted;
    	let dispose;

    	function searchfilter_searchTerm_binding(value) {
    		/*searchfilter_searchTerm_binding*/ ctx[10](value);
    	}

    	let searchfilter_props = {};

    	if (/*searchTerm*/ ctx[6] !== void 0) {
    		searchfilter_props.searchTerm = /*searchTerm*/ ctx[6];
    	}

    	searchfilter = new SearchFilter({
    			props: searchfilter_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(searchfilter, 'searchTerm', searchfilter_searchTerm_binding));
    	searchfilter.$on("input", /*searchProjects*/ ctx[9]);
    	let if_block0 = /*visible*/ ctx[7] && create_if_block_4(ctx);
    	const if_block_creators = [create_if_block_2, create_if_block_3, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if ((/*searchTerm*/ ctx[6] || /*confirmed_domains*/ ctx[5].length > 0) && /*filteredProjects*/ ctx[3].length === 0) return 0;
    		if (/*filteredProjects*/ ctx[3].length > 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[12][0]);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			div0.textContent = "Projects";
    			t1 = space();
    			create_component(searchfilter.$$.fragment);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if_block1.c();
    			t4 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div1 = element("div");
    			div1.textContent = "Domain";
    			t6 = space();
    			small0 = element("small");
    			div7 = element("div");
    			div2 = element("div");
    			input0 = element("input");
    			t7 = text("\r\n                                         ");
    			label0 = element("label");
    			label0.textContent = "AI";
    			t9 = space();
    			div3 = element("div");
    			input1 = element("input");
    			t10 = text("\r\n                                         ");
    			label1 = element("label");
    			label1.textContent = "Web";
    			t12 = space();
    			div4 = element("div");
    			input2 = element("input");
    			t13 = text("\r\n                                         ");
    			label2 = element("label");
    			label2.textContent = "CLI";
    			t15 = space();
    			div5 = element("div");
    			input3 = element("input");
    			t16 = text("\r\n                                         ");
    			label3 = element("label");
    			label3.textContent = "Android";
    			t18 = space();
    			div6 = element("div");
    			input4 = element("input");
    			t19 = text("\r\n                                         ");
    			label4 = element("label");
    			label4.textContent = "Windows";
    			t21 = space();
    			hr = element("hr");
    			t22 = space();
    			div8 = element("div");
    			button0 = element("button");
    			small1 = element("small");
    			small1.textContent = "Close";
    			t24 = space();
    			button1 = element("button");
    			small2 = element("small");
    			small2.textContent = "Apply";
    			attr_dev(div0, "class", "fs-2");
    			add_location(div0, file, 72, 12, 2496);
    			attr_dev(div1, "class", "font-weight-500 mb-1");
    			add_location(div1, file, 102, 28, 4217);
    			attr_dev(input0, "class", "form-check-input");
    			attr_dev(input0, "type", "checkbox");
    			input0.__value = 'AI';
    			input0.value = input0.__value;
    			attr_dev(input0, "id", "ai");
    			add_location(input0, file, 109, 40, 4545);
    			attr_dev(label0, "for", "ai");
    			add_location(label0, file, 110, 46, 4692);
    			attr_dev(div2, "class", "col-6 my-1");
    			add_location(div2, file, 108, 36, 4479);
    			attr_dev(input1, "class", "form-check-input");
    			attr_dev(input1, "type", "checkbox");
    			input1.__value = 'Web';
    			input1.value = input1.__value;
    			attr_dev(input1, "id", "web");
    			add_location(input1, file, 113, 40, 4866);
    			attr_dev(label1, "for", "web");
    			add_location(label1, file, 114, 46, 5016);
    			attr_dev(div3, "class", "col-6 my-1");
    			add_location(div3, file, 112, 36, 4800);
    			attr_dev(input2, "class", "form-check-input");
    			attr_dev(input2, "type", "checkbox");
    			input2.__value = 'Cli';
    			input2.value = input2.__value;
    			attr_dev(input2, "id", "cli");
    			add_location(input2, file, 117, 40, 5192);
    			attr_dev(label2, "for", "cli");
    			add_location(label2, file, 118, 46, 5341);
    			attr_dev(div4, "class", "col-6 my-1");
    			add_location(div4, file, 116, 36, 5126);
    			attr_dev(input3, "class", "form-check-input");
    			attr_dev(input3, "type", "checkbox");
    			input3.__value = 'Android';
    			input3.value = input3.__value;
    			attr_dev(input3, "id", "android");
    			add_location(input3, file, 121, 40, 5517);
    			attr_dev(label3, "for", "android");
    			add_location(label3, file, 122, 46, 5675);
    			attr_dev(div5, "class", "col-6 my-1");
    			add_location(div5, file, 120, 36, 5451);
    			attr_dev(input4, "class", "form-check-input");
    			attr_dev(input4, "type", "checkbox");
    			input4.__value = 'Windows';
    			input4.value = input4.__value;
    			attr_dev(input4, "id", "windows");
    			add_location(input4, file, 125, 40, 5859);
    			attr_dev(label4, "for", "windows");
    			add_location(label4, file, 126, 46, 6016);
    			attr_dev(div6, "class", "col-6 my-1");
    			add_location(div6, file, 124, 36, 5793);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file, 107, 32, 4424);
    			add_location(small0, file, 106, 28, 4383);
    			add_location(hr, file, 131, 28, 6234);
    			add_location(small1, file, 134, 132, 6455);
    			attr_dev(button0, "class", "btn btn-sm btn-outline-primary text-white px-4 rounded-pill");
    			attr_dev(button0, "data-bs-dismiss", "modal");
    			add_location(button0, file, 134, 32, 6355);
    			add_location(small2, file, 135, 158, 6644);
    			attr_dev(button1, "class", "btn btn-sm btn-outline-primary text-white px-4 rounded-pill");
    			attr_dev(button1, "data-bs-dismiss", "modal");
    			add_location(button1, file, 135, 32, 6518);
    			attr_dev(div8, "class", "text-end");
    			add_location(div8, file, 133, 28, 6299);
    			attr_dev(div9, "class", "modal-body mx-2");
    			add_location(div9, file, 101, 24, 4158);
    			attr_dev(div10, "class", "modal-content bg-custom shadow");
    			add_location(div10, file, 100, 20, 4088);
    			attr_dev(div11, "class", "modal-dialog modal-dialog-centered");
    			add_location(div11, file, 99, 16, 4018);
    			attr_dev(div12, "class", "modal fade");
    			attr_dev(div12, "id", "filterModal");
    			attr_dev(div12, "tabindex", "-1");
    			attr_dev(div12, "aria-hidden", "true");
    			add_location(div12, file, 98, 12, 3926);
    			attr_dev(section, "class", "text-white");
    			attr_dev(section, "id", "projects");
    			add_location(section, file, 70, 8, 2426);
    			binding_group.p(input0, input1, input2, input3, input4);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t1);
    			mount_component(searchfilter, section, null);
    			append_dev(section, t2);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t3);
    			if_blocks[current_block_type_index].m(section, null);
    			append_dev(section, t4);
    			append_dev(section, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div1);
    			append_dev(div9, t6);
    			append_dev(div9, small0);
    			append_dev(small0, div7);
    			append_dev(div7, div2);
    			append_dev(div2, input0);
    			input0.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input0.__value);
    			append_dev(div2, t7);
    			append_dev(div2, label0);
    			append_dev(div7, t9);
    			append_dev(div7, div3);
    			append_dev(div3, input1);
    			input1.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input1.__value);
    			append_dev(div3, t10);
    			append_dev(div3, label1);
    			append_dev(div7, t12);
    			append_dev(div7, div4);
    			append_dev(div4, input2);
    			input2.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input2.__value);
    			append_dev(div4, t13);
    			append_dev(div4, label2);
    			append_dev(div7, t15);
    			append_dev(div7, div5);
    			append_dev(div5, input3);
    			input3.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input3.__value);
    			append_dev(div5, t16);
    			append_dev(div5, label3);
    			append_dev(div7, t18);
    			append_dev(div7, div6);
    			append_dev(div6, input4);
    			input4.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input4.__value);
    			append_dev(div6, t19);
    			append_dev(div6, label4);
    			append_dev(div9, t21);
    			append_dev(div9, hr);
    			append_dev(div9, t22);
    			append_dev(div9, div8);
    			append_dev(div8, button0);
    			append_dev(button0, small1);
    			append_dev(div8, t24);
    			append_dev(div8, button1);
    			append_dev(button1, small2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_handler*/ ctx[11]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[13]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[14]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[15]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[16]),
    					listen_dev(button1, "click", /*searchProjects*/ ctx[9], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const searchfilter_changes = {};

    			if (!updating_searchTerm && dirty & /*searchTerm*/ 64) {
    				updating_searchTerm = true;
    				searchfilter_changes.searchTerm = /*searchTerm*/ ctx[6];
    				add_flush_callback(() => updating_searchTerm = false);
    			}

    			searchfilter.$set(searchfilter_changes);

    			if (/*visible*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(section, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(section, t4);
    			}

    			if (dirty & /*selected_domains*/ 16) {
    				input0.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input0.__value);
    			}

    			if (dirty & /*selected_domains*/ 16) {
    				input1.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input1.__value);
    			}

    			if (dirty & /*selected_domains*/ 16) {
    				input2.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input2.__value);
    			}

    			if (dirty & /*selected_domains*/ 16) {
    				input3.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input3.__value);
    			}

    			if (dirty & /*selected_domains*/ 16) {
    				input4.checked = ~(/*selected_domains*/ ctx[4] || []).indexOf(input4.__value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchfilter.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchfilter.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(searchfilter);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			binding_group.r();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(70:46) ",
    		ctx
    	});

    	return block;
    }

    // (68:4) {#if $selectedNavItem === 'home'}
    function create_if_block(ctx) {
    	let home;
    	let current;

    	home = new Home({
    			props: {
    				exp: /*exp*/ ctx[0],
    				time_remaining: /*time_remaining*/ ctx[2],
    				age: /*age*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const home_changes = {};
    			if (dirty & /*exp*/ 1) home_changes.exp = /*exp*/ ctx[0];
    			if (dirty & /*time_remaining*/ 4) home_changes.time_remaining = /*time_remaining*/ ctx[2];
    			if (dirty & /*age*/ 2) home_changes.age = /*age*/ ctx[1];
    			home.$set(home_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(68:4) {#if $selectedNavItem === 'home'}",
    		ctx
    	});

    	return block;
    }

    // (77:12) {#if visible}
    function create_if_block_4(ctx) {
    	let each_1_anchor;
    	let each_value_2 = /*confirmed_domains*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*confirmed_domains*/ 32) {
    				each_value_2 = /*confirmed_domains*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(77:12) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (78:16) {#each confirmed_domains as d}
    function create_each_block_2(ctx) {
    	let span1;
    	let span0;
    	let t0_value = /*d*/ ctx[23] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = text(" ");
    			attr_dev(span0, "class", "font-size-xsmall align-middle");
    			add_location(span0, file, 79, 24, 2811);
    			attr_dev(span1, "class", "px-2 border border-1 border-primary rounded");
    			add_location(span1, file, 78, 20, 2727);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    			append_dev(span0, t0);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*confirmed_domains*/ 32 && t0_value !== (t0_value = /*d*/ ctx[23] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(78:16) {#each confirmed_domains as d}",
    		ctx
    	});

    	return block;
    }

    // (93:12) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = project_list;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_list*/ 0) {
    				each_value_1 = project_list;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(93:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (89:50) 
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*filteredProjects*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filteredProjects*/ 8) {
    				each_value = /*filteredProjects*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(89:50) ",
    		ctx
    	});

    	return block;
    }

    // (87:12) {#if (searchTerm || confirmed_domains.length>0) && filteredProjects.length === 0}
    function create_if_block_2(ctx) {
    	let notfound;
    	let current;
    	notfound = new NotFound({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(notfound.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notfound, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notfound.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notfound.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notfound, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(87:12) {#if (searchTerm || confirmed_domains.length>0) && filteredProjects.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (94:16) {#each project_list as project}
    function create_each_block_1(ctx) {
    	let projects;
    	let current;

    	projects = new Projects({
    			props: {
    				project_name: /*project*/ ctx[18]['name'],
    				project_description: /*project*/ ctx[18]['description'],
    				project_videolink: /*project*/ ctx[18]['videolink'],
    				project_languages: /*project*/ ctx[18]['languages'],
    				project_links: /*project*/ ctx[18]['links'],
    				project_tags: /*project*/ ctx[18]['tags']
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(projects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projects, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(94:16) {#each project_list as project}",
    		ctx
    	});

    	return block;
    }

    // (90:16) {#each filteredProjects as project}
    function create_each_block(ctx) {
    	let projects;
    	let current;

    	projects = new Projects({
    			props: {
    				project_name: /*project*/ ctx[18]['name'],
    				project_description: /*project*/ ctx[18]['description'],
    				project_videolink: /*project*/ ctx[18]['videolink'],
    				project_languages: /*project*/ ctx[18]['languages'],
    				project_links: /*project*/ ctx[18]['links'],
    				project_tags: /*project*/ ctx[18]['tags']
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(projects.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projects, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const projects_changes = {};
    			if (dirty & /*filteredProjects*/ 8) projects_changes.project_name = /*project*/ ctx[18]['name'];
    			if (dirty & /*filteredProjects*/ 8) projects_changes.project_description = /*project*/ ctx[18]['description'];
    			if (dirty & /*filteredProjects*/ 8) projects_changes.project_videolink = /*project*/ ctx[18]['videolink'];
    			if (dirty & /*filteredProjects*/ 8) projects_changes.project_languages = /*project*/ ctx[18]['languages'];
    			if (dirty & /*filteredProjects*/ 8) projects_changes.project_links = /*project*/ ctx[18]['links'];
    			if (dirty & /*filteredProjects*/ 8) projects_changes.project_tags = /*project*/ ctx[18]['tags'];
    			projects.$set(projects_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projects.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projects.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projects, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(90:16) {#each filteredProjects as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let navbar;
    	let t;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$selectedNavItem*/ ctx[8] === 'home') return 0;
    		if (/*$selectedNavItem*/ ctx[8] === 'projects') return 1;
    		if (/*$selectedNavItem*/ ctx[8] === 'skills') return 2;
    		if (/*$selectedNavItem*/ ctx[8] === 'blog') return 3;
    		if (/*$selectedNavItem*/ ctx[8] === 'collections') return 4;
    		if (/*$selectedNavItem*/ ctx[8] === 'snippets') return 5;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t = space();
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "container mt-5 pt-4");
    			add_location(div, file, 66, 0, 2227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function diffInDates(date1, date2) {
    	let years = date2.getFullYear() - date1.getFullYear();
    	let months = date2.getMonth() - date1.getMonth();
    	let days = date2.getDate() - date1.getDate();

    	if (days < 0) {
    		months--;
    		let lastMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
    		days = lastMonth.getDate() - date1.getDate() + date2.getDate();
    	}

    	if (months < 0) {
    		years--;
    		months += 12;
    	}

    	return [years, months, days];
    }

    function instance($$self, $$props, $$invalidate) {
    	let $selectedNavItem;
    	validate_store(selectedNavItem, 'selectedNavItem');
    	component_subscribe($$self, selectedNavItem, $$value => $$invalidate(8, $selectedNavItem = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let exp = [];
    	let age = [];
    	let time_remaining = [];

    	onMount(() => {
    		$$invalidate(1, age = diffInDates(new Date("1999-08-03"), new Date()));
    		$$invalidate(0, exp = diffInDates(new Date("2021-01-21"), new Date()));
    		$$invalidate(2, time_remaining = diffInDates(new Date(), new Date("2023-04-30")));
    	});

    	let filteredProjects = [];
    	let selected_domains = [];
    	let confirmed_domains = [];
    	let searchTerm = "";
    	let visible = false;

    	const show = () => {
    		$$invalidate(5, confirmed_domains = selected_domains);
    		$$invalidate(7, visible = confirmed_domains.length > 0 ? true : false);
    	};

    	const searchProjects = () => {
    		show();

    		return $$invalidate(3, filteredProjects = project_list.filter(project => {
    			let projectName = project.name.toLowerCase();

    			if (confirmed_domains.length > 0) {
    				return confirmed_domains.some(item => project.tags.includes(item))
    				? projectName.includes(searchTerm.toLowerCase())
    				: false;
    			} else return projectName.includes(searchTerm.toLowerCase());
    		}));
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function searchfilter_searchTerm_binding(value) {
    		searchTerm = value;
    		$$invalidate(6, searchTerm);
    	}

    	function input0_change_handler() {
    		selected_domains = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selected_domains);
    	}

    	function input1_change_handler() {
    		selected_domains = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selected_domains);
    	}

    	function input2_change_handler() {
    		selected_domains = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selected_domains);
    	}

    	function input3_change_handler() {
    		selected_domains = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selected_domains);
    	}

    	function input4_change_handler() {
    		selected_domains = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		$$invalidate(4, selected_domains);
    	}

    	$$self.$capture_state = () => ({
    		Navbar,
    		Home,
    		SearchFilter,
    		Projects,
    		NotFound,
    		Skills,
    		project_list,
    		onMount,
    		selectedNavItem,
    		Blog,
    		Collections,
    		diffInDates,
    		exp,
    		age,
    		time_remaining,
    		filteredProjects,
    		selected_domains,
    		confirmed_domains,
    		searchTerm,
    		visible,
    		show,
    		searchProjects,
    		$selectedNavItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('exp' in $$props) $$invalidate(0, exp = $$props.exp);
    		if ('age' in $$props) $$invalidate(1, age = $$props.age);
    		if ('time_remaining' in $$props) $$invalidate(2, time_remaining = $$props.time_remaining);
    		if ('filteredProjects' in $$props) $$invalidate(3, filteredProjects = $$props.filteredProjects);
    		if ('selected_domains' in $$props) $$invalidate(4, selected_domains = $$props.selected_domains);
    		if ('confirmed_domains' in $$props) $$invalidate(5, confirmed_domains = $$props.confirmed_domains);
    		if ('searchTerm' in $$props) $$invalidate(6, searchTerm = $$props.searchTerm);
    		if ('visible' in $$props) $$invalidate(7, visible = $$props.visible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		exp,
    		age,
    		time_remaining,
    		filteredProjects,
    		selected_domains,
    		confirmed_domains,
    		searchTerm,
    		visible,
    		$selectedNavItem,
    		searchProjects,
    		searchfilter_searchTerm_binding,
    		input0_change_handler,
    		$$binding_groups,
    		input1_change_handler,
    		input2_change_handler,
    		input3_change_handler,
    		input4_change_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
    	target: document.body,
    	intro: true
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
