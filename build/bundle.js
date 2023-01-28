
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
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
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
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
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
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
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
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
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
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

    function bind(component, name, callback, value) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            if (value === undefined) {
                callback(component.$$.ctx[index]);
            }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.0' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
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
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\Navbar.svelte generated by Svelte v3.55.0 */

    const file$9 = "src\\Navbar.svelte";

    function create_fragment$a(ctx) {
    	let nav;
    	let div4;
    	let span0;
    	let t0;
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
    	let t1;
    	let div3;
    	let div1;
    	let div0;
    	let svg1;
    	let g3;
    	let g4;
    	let g6;
    	let g5;
    	let rect0;
    	let rect1;
    	let rect2;
    	let rect3;
    	let t2;
    	let button1;
    	let svg2;
    	let g7;
    	let g8;
    	let g9;
    	let path4;
    	let t3;
    	let div2;
    	let ul;
    	let li0;
    	let a0;
    	let svg3;
    	let g10;
    	let g11;
    	let path5;
    	let g12;
    	let path6;
    	let t4;
    	let span1;
    	let t6;
    	let li1;
    	let a1;
    	let svg4;
    	let g13;
    	let g14;
    	let g15;
    	let path7;
    	let t7;
    	let span2;
    	let t9;
    	let li2;
    	let a2;
    	let svg5;
    	let g16;
    	let g17;
    	let g18;
    	let path8;
    	let t10;
    	let span3;
    	let t12;
    	let li3;
    	let a3;
    	let svg6;
    	let g19;
    	let g20;
    	let g21;
    	let path9;
    	let t13;
    	let span4;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div4 = element("div");
    			span0 = element("span");
    			t0 = space();
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
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			svg1 = svg_element("svg");
    			g3 = svg_element("g");
    			g4 = svg_element("g");
    			g6 = svg_element("g");
    			g5 = svg_element("g");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			rect3 = svg_element("rect");
    			t2 = space();
    			button1 = element("button");
    			svg2 = svg_element("svg");
    			g7 = svg_element("g");
    			g8 = svg_element("g");
    			g9 = svg_element("g");
    			path4 = svg_element("path");
    			t3 = space();
    			div2 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			svg3 = svg_element("svg");
    			g10 = svg_element("g");
    			g11 = svg_element("g");
    			path5 = svg_element("path");
    			g12 = svg_element("g");
    			path6 = svg_element("path");
    			t4 = text("\r\n                       ");
    			span1 = element("span");
    			span1.textContent = "Home";
    			t6 = space();
    			li1 = element("li");
    			a1 = element("a");
    			svg4 = svg_element("svg");
    			g13 = svg_element("g");
    			g14 = svg_element("g");
    			g15 = svg_element("g");
    			path7 = svg_element("path");
    			t7 = text("\r\n                       ");
    			span2 = element("span");
    			span2.textContent = "About";
    			t9 = space();
    			li2 = element("li");
    			a2 = element("a");
    			svg5 = svg_element("svg");
    			g16 = svg_element("g");
    			g17 = svg_element("g");
    			g18 = svg_element("g");
    			path8 = svg_element("path");
    			t10 = text("\r\n                       ");
    			span3 = element("span");
    			span3.textContent = "Skills";
    			t12 = space();
    			li3 = element("li");
    			a3 = element("a");
    			svg6 = svg_element("svg");
    			g19 = svg_element("g");
    			g20 = svg_element("g");
    			g21 = svg_element("g");
    			path9 = svg_element("path");
    			t13 = text("\r\n                       ");
    			span4 = element("span");
    			span4.textContent = "Projects";
    			add_location(span0, file$9, 2, 7, 101);
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$9, 5, 13, 473);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$9, 6, 13, 535);
    			add_location(title, file$9, 8, 16, 677);
    			attr_dev(path0, "d", "M21.86,18.73H9.18a2,2,0,0,1,0-4H21.86a2,2,0,0,1,0,4Z");
    			add_location(path0, file$9, 9, 16, 710);
    			attr_dev(path1, "d", "M54.82,18.73H34.88a2,2,0,0,1,0-4H54.82a2,2,0,0,1,0,4Z");
    			add_location(path1, file$9, 10, 16, 798);
    			attr_dev(path2, "d", "M54.82,34H9.18a2,2,0,0,1,0-4H54.82a2,2,0,0,1,0,4Z");
    			add_location(path2, file$9, 11, 16, 887);
    			attr_dev(path3, "d", "M54.82,49.27H30.07a2,2,0,0,1,0-4H54.82a2,2,0,0,1,0,4Z");
    			add_location(path3, file$9, 12, 16, 972);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$9, 7, 13, 631);
    			attr_dev(svg0, "fill", "#ffffff");
    			attr_dev(svg0, "width", "1.9rem");
    			attr_dev(svg0, "height", "1.9rem");
    			attr_dev(svg0, "viewBox", "0 0 64 64");
    			attr_dev(svg0, "data-name", "Layer 1");
    			attr_dev(svg0, "id", "Layer_1");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$9, 4, 10, 319);
    			attr_dev(button0, "class", "btn bg-transparent border-0");
    			attr_dev(button0, "aria-label", "toogle offcanvas");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-bs-toggle", "offcanvas");
    			attr_dev(button0, "data-bs-target", "#offcanvasDarkNavbar");
    			attr_dev(button0, "aria-controls", "offcanvasDarkNavbar");
    			add_location(button0, file$9, 3, 7, 118);
    			attr_dev(g3, "id", "SVGRepo_bgCarrier");
    			attr_dev(g3, "stroke-width", "0");
    			add_location(g3, file$9, 20, 19, 1501);
    			attr_dev(g4, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g4, "stroke-linecap", "round");
    			attr_dev(g4, "stroke-linejoin", "round");
    			add_location(g4, file$9, 21, 19, 1569);
    			attr_dev(rect0, "width", "8");
    			attr_dev(rect0, "height", "8");
    			attr_dev(rect0, "rx", "2");
    			add_location(rect0, file$9, 24, 25, 1788);
    			attr_dev(rect1, "width", "8");
    			attr_dev(rect1, "height", "8");
    			attr_dev(rect1, "x", "10");
    			attr_dev(rect1, "rx", "2");
    			add_location(rect1, file$9, 25, 25, 1856);
    			attr_dev(rect2, "width", "8");
    			attr_dev(rect2, "height", "8");
    			attr_dev(rect2, "x", "10");
    			attr_dev(rect2, "y", "10");
    			attr_dev(rect2, "rx", "2");
    			add_location(rect2, file$9, 26, 25, 1931);
    			attr_dev(rect3, "width", "8");
    			attr_dev(rect3, "height", "8");
    			attr_dev(rect3, "y", "10");
    			attr_dev(rect3, "rx", "2");
    			add_location(rect3, file$9, 27, 25, 2013);
    			attr_dev(g5, "fill", "#ffffff");
    			attr_dev(g5, "fill-rule", "nonzero");
    			add_location(g5, file$9, 23, 22, 1723);
    			attr_dev(g6, "id", "SVGRepo_iconCarrier");
    			add_location(g6, file$9, 22, 19, 1671);
    			attr_dev(svg1, "width", "1.7rem");
    			attr_dev(svg1, "height", "1.7rem");
    			attr_dev(svg1, "viewBox", "0 0 18 18");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "fill", "#ffffff");
    			add_location(svg1, file$9, 19, 16, 1374);
    			attr_dev(div0, "class", "offcanvas-header-logo-padding");
    			add_location(div0, file$9, 18, 13, 1313);
    			attr_dev(g7, "id", "SVGRepo_bgCarrier");
    			attr_dev(g7, "stroke-width", "0");
    			add_location(g7, file$9, 34, 19, 2457);
    			attr_dev(g8, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g8, "stroke-linecap", "round");
    			attr_dev(g8, "stroke-linejoin", "round");
    			add_location(g8, file$9, 35, 19, 2525);
    			attr_dev(path4, "d", "M19.9201 15.0501L13.4001 8.53014C12.6301 7.76014 11.3701 7.76014 10.6001 8.53014L4.08008 15.0501");
    			attr_dev(path4, "stroke", "#ffffff");
    			attr_dev(path4, "stroke-width", "1.5");
    			attr_dev(path4, "stroke-miterlimit", "10");
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			add_location(path4, file$9, 37, 22, 2679);
    			attr_dev(g9, "id", "SVGRepo_iconCarrier");
    			add_location(g9, file$9, 36, 19, 2627);
    			attr_dev(svg2, "width", "1.7rem");
    			attr_dev(svg2, "height", "1.7rem");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "transform", "rotate(270)");
    			add_location(svg2, file$9, 33, 16, 2309);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "aria-label", "offcanvas dismiss");
    			attr_dev(button1, "data-bs-dismiss", "offcanvas");
    			attr_dev(button1, "class", "btn bg-transparent border-0");
    			add_location(button1, file$9, 32, 13, 2174);
    			attr_dev(div1, "class", "offcanvas-header");
    			add_location(div1, file$9, 17, 10, 1268);
    			attr_dev(g10, "id", "SVGRepo_bgCarrier");
    			attr_dev(g10, "stroke-width", "0");
    			add_location(g10, file$9, 47, 25, 3351);
    			attr_dev(path5, "d", "M19 7.90637V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V7.90637M2 10.0001L10.8531 3.80297C11.5417 3.32092 12.4583 3.32092 13.1469 3.80297L22 10.0001");
    			attr_dev(path5, "stroke", "#ffffff");
    			attr_dev(path5, "stroke-width", "2.4");
    			attr_dev(path5, "stroke-linecap", "round");
    			attr_dev(path5, "stroke-linejoin", "round");
    			add_location(path5, file$9, 49, 28, 3568);
    			attr_dev(g11, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g11, "stroke-linecap", "round");
    			attr_dev(g11, "stroke-linejoin", "round");
    			attr_dev(g11, "stroke", "#f4f0f0");
    			attr_dev(g11, "stroke-width", "4.8");
    			add_location(g11, file$9, 48, 25, 3425);
    			attr_dev(path6, "d", "M19 7.90637V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V7.90637M2 10.0001L10.8531 3.80297C11.5417 3.32092 12.4583 3.32092 13.1469 3.80297L22 10.0001");
    			attr_dev(path6, "stroke", "#ffffff");
    			attr_dev(path6, "stroke-width", "2.4");
    			attr_dev(path6, "stroke-linecap", "round");
    			attr_dev(path6, "stroke-linejoin", "round");
    			add_location(path6, file$9, 52, 28, 3948);
    			attr_dev(g12, "id", "SVGRepo_iconCarrier");
    			add_location(g12, file$9, 51, 25, 3890);
    			attr_dev(svg3, "width", "1.7rem");
    			attr_dev(svg3, "height", "1.7rem");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "fill", "none");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg3, file$9, 46, 22, 3221);
    			attr_dev(span1, "class", "align-bottom mx-1");
    			add_location(span1, file$9, 55, 28, 4303);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "#top");
    			add_location(a0, file$9, 45, 19, 3165);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$9, 44, 16, 3123);
    			attr_dev(g13, "id", "SVGRepo_bgCarrier");
    			attr_dev(g13, "stroke-width", "0");
    			add_location(g13, file$9, 61, 25, 4761);
    			attr_dev(g14, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g14, "stroke-linecap", "round");
    			attr_dev(g14, "stroke-linejoin", "round");
    			add_location(g14, file$9, 62, 25, 4835);
    			attr_dev(path7, "id", "primary");
    			attr_dev(path7, "d", "M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,8,8,0,0,1,1.79-5,2,2,0,0,1,2.67-.39,8.07,8.07,0,0,0,9.07,0,2,2,0,0,1,2.68.39A8,8,0,0,1,21,20Zm-9-6A6,6,0,1,0,6,8,6,6,0,0,0,12,14Z");
    			set_style(path7, "fill", "#ffffff");
    			add_location(path7, file$9, 64, 28, 5001);
    			attr_dev(g15, "id", "SVGRepo_iconCarrier");
    			add_location(g15, file$9, 63, 25, 4943);
    			attr_dev(svg4, "fill", "#ffffff");
    			attr_dev(svg4, "width", "1.67rem");
    			attr_dev(svg4, "height", "1.67rem");
    			attr_dev(svg4, "viewBox", "0 0 24 24");
    			attr_dev(svg4, "id", "user-3");
    			attr_dev(svg4, "data-name", "Flat Color");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "class", "icon flat-color");
    			attr_dev(svg4, "stroke", "#ffffff");
    			attr_dev(svg4, "stroke-width", "0.00024000000000000003");
    			add_location(svg4, file$9, 60, 22, 4512);
    			attr_dev(span2, "class", "align-bottom mx-1");
    			add_location(span2, file$9, 67, 28, 5312);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "#about");
    			add_location(a1, file$9, 59, 19, 4454);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$9, 58, 16, 4412);
    			attr_dev(g16, "id", "SVGRepo_bgCarrier");
    			attr_dev(g16, "stroke-width", "0");
    			add_location(g16, file$9, 73, 25, 5675);
    			attr_dev(g17, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g17, "stroke-linecap", "round");
    			attr_dev(g17, "stroke-linejoin", "round");
    			add_location(g17, file$9, 74, 25, 5749);
    			attr_dev(path8, "d", "M20.991,10H19.42a1.039,1.039,0,0,1-.951-.674l-.005-.013a1.04,1.04,0,0,1,.2-1.146l1.11-1.11a1.01,1.01,0,0,0,0-1.428l-1.4-1.4a1.01,1.01,0,0,0-1.428,0l-1.11,1.11a1.04,1.04,0,0,1-1.146.2l-.013,0A1.04,1.04,0,0,1,14,4.579V3.009A1.009,1.009,0,0,0,12.991,2H11.009A1.009,1.009,0,0,0,10,3.009v1.57a1.04,1.04,0,0,1-.674.952l-.013,0a1.04,1.04,0,0,1-1.146-.2l-1.11-1.11a1.01,1.01,0,0,0-1.428,0l-1.4,1.4a1.01,1.01,0,0,0,0,1.428l1.11,1.11a1.04,1.04,0,0,1,.2,1.146l0,.013A1.039,1.039,0,0,1,4.58,10H3.009A1.009,1.009,0,0,0,2,11.009v1.982A1.009,1.009,0,0,0,3.009,14H4.58a1.039,1.039,0,0,1,.951.674l0,.013a1.04,1.04,0,0,1-.2,1.146l-1.11,1.11a1.01,1.01,0,0,0,0,1.428l1.4,1.4a1.01,1.01,0,0,0,1.428,0l1.11-1.11a1.04,1.04,0,0,1,1.146-.2l.013.005A1.039,1.039,0,0,1,10,19.42v1.571A1.009,1.009,0,0,0,11.009,22h1.982A1.009,1.009,0,0,0,14,20.991V19.42a1.039,1.039,0,0,1,.674-.951l.013-.005a1.04,1.04,0,0,1,1.146.2l1.11,1.11a1.01,1.01,0,0,0,1.428,0l1.4-1.4a1.01,1.01,0,0,0,0-1.428l-1.11-1.11a1.04,1.04,0,0,1-.2-1.146l.005-.013A1.039,1.039,0,0,1,19.42,14h1.571A1.009,1.009,0,0,0,22,12.991V11.009A1.009,1.009,0,0,0,20.991,10ZM12,15a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z");
    			add_location(path8, file$9, 76, 28, 5915);
    			attr_dev(g18, "id", "SVGRepo_iconCarrier");
    			add_location(g18, file$9, 75, 25, 5857);
    			attr_dev(svg5, "fill", "#ffffff");
    			attr_dev(svg5, "width", "1.67rem");
    			attr_dev(svg5, "height", "1.67rem");
    			attr_dev(svg5, "viewBox", "0 0 24 24");
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "stroke", "#ffffff");
    			add_location(svg5, file$9, 72, 22, 5523);
    			attr_dev(span3, "class", "align-bottom mx-1");
    			add_location(span3, file$9, 79, 28, 7155);
    			attr_dev(a2, "class", "nav-link");
    			attr_dev(a2, "href", "#skills");
    			add_location(a2, file$9, 71, 19, 5464);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$9, 70, 16, 5422);
    			attr_dev(g19, "id", "SVGRepo_bgCarrier");
    			attr_dev(g19, "stroke-width", "0");
    			add_location(g19, file$9, 85, 25, 7518);
    			attr_dev(g20, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g20, "stroke-linecap", "round");
    			attr_dev(g20, "stroke-linejoin", "round");
    			add_location(g20, file$9, 86, 25, 7592);
    			attr_dev(path9, "fill-rule", "evenodd");
    			attr_dev(path9, "clip-rule", "evenodd");
    			attr_dev(path9, "d", "M5.4 2h13.2A3.4 3.4 0 0 1 22 5.4v13.2a3.4 3.4 0 0 1-3.4 3.4H5.4A3.4 3.4 0 0 1 2 18.6V5.4A3.4 3.4 0 0 1 5.4 2ZM7 5a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm5 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Zm6 1a1 1 0 1 0-2 0v10a1 1 0 1 0 2 0V6Z");
    			attr_dev(path9, "fill", "#ffffff");
    			add_location(path9, file$9, 88, 28, 7758);
    			attr_dev(g21, "id", "SVGRepo_iconCarrier");
    			add_location(g21, file$9, 87, 25, 7700);
    			attr_dev(svg6, "width", "1.67rem");
    			attr_dev(svg6, "height", "1.67rem");
    			attr_dev(svg6, "viewBox", "0 0 24 24");
    			attr_dev(svg6, "fill", "none");
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg6, "stroke", "#ffffff");
    			add_location(svg6, file$9, 84, 22, 7369);
    			attr_dev(span4, "class", "align-bottom mx-1");
    			add_location(span4, file$9, 91, 28, 8171);
    			attr_dev(a3, "class", "nav-link");
    			attr_dev(a3, "href", "#projects");
    			add_location(a3, file$9, 83, 19, 7308);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file$9, 82, 16, 7266);
    			attr_dev(ul, "class", "navbar-nav justify-content-end flex-grow-1 pe-3");
    			add_location(ul, file$9, 43, 13, 3045);
    			attr_dev(div2, "class", "offcanvas-body");
    			add_location(div2, file$9, 42, 10, 3002);
    			attr_dev(div3, "class", "offcanvas offcanvas-start text-white bg-custom shadow");
    			attr_dev(div3, "tabindex", "-1");
    			attr_dev(div3, "id", "offcanvasDarkNavbar");
    			attr_dev(div3, "aria-labelledby", "offcanvasDarkNavbarLabel");
    			add_location(div3, file$9, 16, 7, 1107);
    			attr_dev(div4, "class", "container-fluid");
    			add_location(div4, file$9, 1, 4, 63);
    			attr_dev(nav, "class", "navbar navbar-dark bg-transparent fixed-top");
    			add_location(nav, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div4);
    			append_dev(div4, span0);
    			append_dev(div4, t0);
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
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, svg1);
    			append_dev(svg1, g3);
    			append_dev(svg1, g4);
    			append_dev(svg1, g6);
    			append_dev(g6, g5);
    			append_dev(g5, rect0);
    			append_dev(g5, rect1);
    			append_dev(g5, rect2);
    			append_dev(g5, rect3);
    			append_dev(div1, t2);
    			append_dev(div1, button1);
    			append_dev(button1, svg2);
    			append_dev(svg2, g7);
    			append_dev(svg2, g8);
    			append_dev(svg2, g9);
    			append_dev(g9, path4);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, svg3);
    			append_dev(svg3, g10);
    			append_dev(svg3, g11);
    			append_dev(g11, path5);
    			append_dev(svg3, g12);
    			append_dev(g12, path6);
    			append_dev(a0, t4);
    			append_dev(a0, span1);
    			append_dev(ul, t6);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, svg4);
    			append_dev(svg4, g13);
    			append_dev(svg4, g14);
    			append_dev(svg4, g15);
    			append_dev(g15, path7);
    			append_dev(a1, t7);
    			append_dev(a1, span2);
    			append_dev(ul, t9);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, svg5);
    			append_dev(svg5, g16);
    			append_dev(svg5, g17);
    			append_dev(svg5, g18);
    			append_dev(g18, path8);
    			append_dev(a2, t10);
    			append_dev(a2, span3);
    			append_dev(ul, t12);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(a3, svg6);
    			append_dev(svg6, g19);
    			append_dev(svg6, g20);
    			append_dev(svg6, g21);
    			append_dev(g21, path9);
    			append_dev(a3, t13);
    			append_dev(a3, span4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\Experience.svelte generated by Svelte v3.55.0 */

    const file$8 = "src\\Experience.svelte";

    function create_fragment$9(ctx) {
    	let div16;
    	let div15;
    	let h5;
    	let t1;
    	let div0;
    	let t3;
    	let small0;
    	let div3;
    	let div1;
    	let t5;
    	let div2;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let div14;
    	let hr;
    	let t11;
    	let ul;
    	let li0;
    	let t13;
    	let li1;
    	let t15;
    	let li2;
    	let t17;
    	let li3;
    	let t19;
    	let li4;
    	let t21;
    	let li5;
    	let t23;
    	let li6;
    	let t25;
    	let li7;
    	let t27;
    	let div12;
    	let div11;
    	let div4;
    	let svg0;
    	let path0;
    	let t28;
    	let strong;
    	let t29;
    	let small1;
    	let t31;
    	let button;
    	let t32;
    	let div10;
    	let div6;
    	let div5;
    	let t34;
    	let div7;
    	let t36;
    	let div9;
    	let div8;
    	let t38;
    	let div13;
    	let span1;
    	let span0;
    	let t39;
    	let svg1;
    	let g0;
    	let g1;
    	let g2;
    	let path1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div16 = element("div");
    			div15 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Engineer";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Tata Consultancy Services";
    			t3 = space();
    			small0 = element("small");
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "Jan 2021 - Present";
    			t5 = space();
    			div2 = element("div");
    			t6 = text(/*years*/ ctx[0]);
    			t7 = text(" Years, ");
    			t8 = text(/*months*/ ctx[1]);
    			t9 = text(" Months");
    			t10 = space();
    			div14 = element("div");
    			hr = element("hr");
    			t11 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Proven ability to implement machine learning and deep learning models to solve real-world problems";
    			t13 = space();
    			li1 = element("li");
    			li1.textContent = "Strong understanding of natural language processing techniques, including sentiment analysis and text classification";
    			t15 = space();
    			li2 = element("li");
    			li2.textContent = "2+ years of professional experience in the field of machine learning and deep learning, with a focus on natural language processing.";
    			t17 = space();
    			li3 = element("li");
    			li3.textContent = "Proficient in utilizing data analysis and visualization tools, such as Python, R, and SQL.";
    			t19 = space();
    			li4 = element("li");
    			li4.textContent = "Experience in the deployment of machine learning models to production environments utilizing cloud-based platforms, such as AWS and GCP.";
    			t21 = space();
    			li5 = element("li");
    			li5.textContent = "Solid understanding of data management and database management systems.";
    			t23 = space();
    			li6 = element("li");
    			li6.textContent = "Experience in mentoring junior team members.";
    			t25 = space();
    			li7 = element("li");
    			li7.textContent = "Worked with research and development team to optimize existing algorithms and improve performance.";
    			t27 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div4 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t28 = space();
    			strong = element("strong");
    			t29 = space();
    			small1 = element("small");
    			small1.textContent = "Generated by ChatGPT";
    			t31 = space();
    			button = element("button");
    			t32 = space();
    			div10 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div5.textContent = "Description is optimized using ChatGPT.";
    			t34 = space();
    			div7 = element("div");
    			div7.textContent = "Query";
    			t36 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div8.textContent = "I work on machine learning , deep learning, nlp , data analysis , api development, managing databases. I also train other employees and i work with the research and development team. I have optimized existing algorithms to work faster. I have deployed many ml models to production.optimize this into bullet points for my resume";
    			t38 = space();
    			div13 = element("div");
    			span1 = element("span");
    			span0 = element("span");
    			t39 = text("Generated by ChatGPT \r\n                ");
    			svg1 = svg_element("svg");
    			g0 = svg_element("g");
    			g1 = svg_element("g");
    			g2 = svg_element("g");
    			path1 = svg_element("path");
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$8, 13, 7, 333);
    			add_location(div0, file$8, 14, 7, 378);
    			add_location(div1, file$8, 17, 13, 518);
    			add_location(div2, file$8, 18, 13, 562);
    			attr_dev(div3, "class", "d-flex justify-content-between");
    			add_location(div3, file$8, 16, 10, 459);
    			attr_dev(small0, "class", "fw-light");
    			add_location(small0, file$8, 15, 7, 423);
    			add_location(hr, file$8, 24, 10, 720);
    			attr_dev(li0, "class", "my-2");
    			add_location(li0, file$8, 26, 13, 773);
    			attr_dev(li1, "class", "my-2");
    			add_location(li1, file$8, 29, 13, 941);
    			attr_dev(li2, "class", "my-2");
    			add_location(li2, file$8, 32, 13, 1127);
    			attr_dev(li3, "class", "my-2");
    			add_location(li3, file$8, 35, 13, 1329);
    			attr_dev(li4, "class", "my-2");
    			add_location(li4, file$8, 38, 13, 1489);
    			attr_dev(li5, "class", "my-2");
    			add_location(li5, file$8, 41, 13, 1695);
    			attr_dev(li6, "class", "my-2");
    			add_location(li6, file$8, 44, 13, 1836);
    			attr_dev(li7, "class", "my-2");
    			add_location(li7, file$8, 47, 13, 1950);
    			attr_dev(ul, "class", "ps-custom");
    			add_location(ul, file$8, 25, 10, 736);
    			attr_dev(path0, "d", "M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z");
    			attr_dev(path0, "fill", "#00ffbf");
    			add_location(path0, file$8, 55, 22, 2597);
    			attr_dev(svg0, "width", "26");
    			attr_dev(svg0, "height", "26");
    			attr_dev(svg0, "viewBox", "0 0 41 41");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "stroke-width", "1.5");
    			attr_dev(svg0, "class", "h-6 w-6");
    			add_location(svg0, file$8, 54, 19, 2443);
    			attr_dev(strong, "class", "me-auto");
    			add_location(strong, file$8, 60, 19, 6866);
    			add_location(small1, file$8, 61, 19, 6920);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn-close");
    			attr_dev(button, "data-bs-dismiss", "toast");
    			attr_dev(button, "aria-label", "Close");
    			add_location(button, file$8, 62, 19, 6976);
    			attr_dev(div4, "class", "toast-header bg-custom");
    			add_location(div4, file$8, 53, 16, 2386);
    			attr_dev(div5, "class", "mx-2");
    			add_location(div5, file$8, 66, 22, 7239);
    			attr_dev(div6, "class", "border border-1 rounded py-2");
    			add_location(div6, file$8, 65, 19, 7173);
    			attr_dev(div7, "class", "py-2 mx-2 font-weight-500");
    			add_location(div7, file$8, 68, 19, 7350);
    			attr_dev(div8, "class", "mx-2");
    			add_location(div8, file$8, 70, 22, 7487);
    			attr_dev(div9, "class", "border border-1 rounded py-2");
    			add_location(div9, file$8, 69, 19, 7421);
    			attr_dev(div10, "class", "toast-body bg-custom rounded");
    			add_location(div10, file$8, 64, 16, 7110);
    			attr_dev(div11, "id", "liveToast");
    			attr_dev(div11, "class", "rounded toast fade hide shadow");
    			attr_dev(div11, "role", "alert");
    			attr_dev(div11, "aria-live", "assertive");
    			attr_dev(div11, "aria-atomic", "true");
    			attr_dev(div11, "data-bs-delay", "10000");
    			add_location(div11, file$8, 52, 13, 2233);
    			attr_dev(div12, "class", "toast-container position-fixed bottom-0 start-50 translate-middle-x p-3 ");
    			add_location(div12, file$8, 51, 10, 2132);
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$8, 82, 19, 8365);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$8, 83, 19, 8433);
    			attr_dev(path1, "clip-rule", "evenodd");
    			attr_dev(path1, "d", "m12 3.75c-4.55635 0-8.25 3.69365-8.25 8.25 0 4.5563 3.69365 8.25 8.25 8.25 4.5563 0 8.25-3.6937 8.25-8.25 0-4.55635-3.6937-8.25-8.25-8.25zm-9.75 8.25c0-5.38478 4.36522-9.75 9.75-9.75 5.3848 0 9.75 4.36522 9.75 9.75 0 5.3848-4.3652 9.75-9.75 9.75-5.38478 0-9.75-4.3652-9.75-9.75zm9.75-.75c.4142 0 .75.3358.75.75v3.5c0 .4142-.3358.75-.75.75s-.75-.3358-.75-.75v-3.5c0-.4142.3358-.75.75-.75zm0-3.25c-.5523 0-1 .44772-1 1s.4477 1 1 1h.01c.5523 0 1-.44772 1-1s-.4477-1-1-1z");
    			attr_dev(path1, "fill", "#ffffff");
    			attr_dev(path1, "fill-rule", "evenodd");
    			add_location(path1, file$8, 85, 22, 8587);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$8, 84, 19, 8535);
    			attr_dev(svg1, "width", "18px");
    			attr_dev(svg1, "height", "18px");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$8, 81, 16, 8245);
    			attr_dev(span0, "id", "chatgpt");
    			add_location(span0, file$8, 79, 13, 8169);
    			attr_dev(span1, "type", "button");
    			add_location(span1, file$8, 78, 13, 8113);
    			attr_dev(div13, "class", "text-end");
    			add_location(div13, file$8, 77, 10, 8076);
    			attr_dev(div14, "class", "card-text mt-3");
    			add_location(div14, file$8, 23, 7, 680);
    			attr_dev(div15, "class", "card-body");
    			add_location(div15, file$8, 12, 4, 301);
    			attr_dev(div16, "class", "card border-primary mb-3 bg-transparent text-white");
    			add_location(div16, file$8, 11, 0, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div15);
    			append_dev(div15, h5);
    			append_dev(div15, t1);
    			append_dev(div15, div0);
    			append_dev(div15, t3);
    			append_dev(div15, small0);
    			append_dev(small0, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, t6);
    			append_dev(div2, t7);
    			append_dev(div2, t8);
    			append_dev(div2, t9);
    			append_dev(div15, t10);
    			append_dev(div15, div14);
    			append_dev(div14, hr);
    			append_dev(div14, t11);
    			append_dev(div14, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t13);
    			append_dev(ul, li1);
    			append_dev(ul, t15);
    			append_dev(ul, li2);
    			append_dev(ul, t17);
    			append_dev(ul, li3);
    			append_dev(ul, t19);
    			append_dev(ul, li4);
    			append_dev(ul, t21);
    			append_dev(ul, li5);
    			append_dev(ul, t23);
    			append_dev(ul, li6);
    			append_dev(ul, t25);
    			append_dev(ul, li7);
    			append_dev(div14, t27);
    			append_dev(div14, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div4);
    			append_dev(div4, svg0);
    			append_dev(svg0, path0);
    			append_dev(div4, t28);
    			append_dev(div4, strong);
    			append_dev(div4, t29);
    			append_dev(div4, small1);
    			append_dev(div4, t31);
    			append_dev(div4, button);
    			append_dev(div11, t32);
    			append_dev(div11, div10);
    			append_dev(div10, div6);
    			append_dev(div6, div5);
    			append_dev(div10, t34);
    			append_dev(div10, div7);
    			append_dev(div10, t36);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div14, t38);
    			append_dev(div14, div13);
    			append_dev(div13, span1);
    			append_dev(span1, span0);
    			append_dev(span0, t39);
    			append_dev(span0, svg1);
    			append_dev(svg1, g0);
    			append_dev(svg1, g1);
    			append_dev(svg1, g2);
    			append_dev(g2, path1);

    			if (!mounted) {
    				dispose = listen_dev(span1, "click", showToast, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*years*/ 1) set_data_dev(t6, /*years*/ ctx[0]);
    			if (dirty & /*months*/ 2) set_data_dev(t8, /*months*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div16);
    			mounted = false;
    			dispose();
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

    function showToast() {
    	let elem = document.getElementById("liveToast");
    	const toast = new bootstrap.Toast(elem);
    	toast.show();
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Experience', slots, []);
    	let { years } = $$props;
    	let { months } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (years === undefined && !('years' in $$props || $$self.$$.bound[$$self.$$.props['years']])) {
    			console.warn("<Experience> was created without expected prop 'years'");
    		}

    		if (months === undefined && !('months' in $$props || $$self.$$.bound[$$self.$$.props['months']])) {
    			console.warn("<Experience> was created without expected prop 'months'");
    		}
    	});

    	const writable_props = ['years', 'months'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('years' in $$props) $$invalidate(0, years = $$props.years);
    		if ('months' in $$props) $$invalidate(1, months = $$props.months);
    	};

    	$$self.$capture_state = () => ({ years, months, showToast });

    	$$self.$inject_state = $$props => {
    		if ('years' in $$props) $$invalidate(0, years = $$props.years);
    		if ('months' in $$props) $$invalidate(1, months = $$props.months);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [years, months];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { years: 0, months: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get years() {
    		throw new Error("<Experience>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set years(value) {
    		throw new Error("<Experience>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get months() {
    		throw new Error("<Experience>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set months(value) {
    		throw new Error("<Experience>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Education.svelte generated by Svelte v3.55.0 */

    const file$7 = "src\\Education.svelte";

    function create_fragment$8(ctx) {
    	let div0;
    	let t1;
    	let div5;
    	let div4;
    	let h5;
    	let t3;
    	let div1;
    	let t5;
    	let div2;
    	let small;
    	let t7;
    	let div3;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Education";
    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			h5 = element("h5");
    			h5.textContent = "Master In Computer Science";
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = "Pune University";
    			t5 = space();
    			div2 = element("div");
    			small = element("small");
    			small.textContent = "June 2020 - June 2022";
    			t7 = space();
    			div3 = element("div");
    			div3.textContent = "CGPA 9.6";
    			attr_dev(div0, "class", "fs-2 text-white ms-1 my-2");
    			add_location(div0, file$7, 0, 0, 0);
    			attr_dev(h5, "class", "card-title");
    			add_location(h5, file$7, 3, 6, 156);
    			add_location(div1, file$7, 4, 6, 218);
    			attr_dev(small, "class", "fw-light");
    			add_location(small, file$7, 5, 11, 257);
    			add_location(div2, file$7, 5, 6, 252);
    			attr_dev(div3, "class", "card-text fw-light mt-2");
    			add_location(div3, file$7, 6, 6, 324);
    			attr_dev(div4, "class", "card-body");
    			add_location(div4, file$7, 2, 3, 125);
    			attr_dev(div5, "class", "card border-primary mb-3 bg-transparent text-white");
    			add_location(div5, file$7, 1, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, h5);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div4, t5);
    			append_dev(div4, div2);
    			append_dev(div2, small);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div5);
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

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Education', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Education> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Education extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Education",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\Skills.svelte generated by Svelte v3.55.0 */

    const file$6 = "src\\Skills.svelte";

    function create_fragment$7(ctx) {
    	let div0;
    	let t1;
    	let small;
    	let t3;
    	let div41;
    	let div5;
    	let div4;
    	let div1;
    	let t5;
    	let div3;
    	let div2;
    	let li0;
    	let t7;
    	let li1;
    	let t9;
    	let li2;
    	let t11;
    	let li3;
    	let t13;
    	let li4;
    	let t15;
    	let li5;
    	let t17;
    	let li6;
    	let t19;
    	let li7;
    	let t21;
    	let li8;
    	let t23;
    	let div10;
    	let div9;
    	let div6;
    	let t25;
    	let div8;
    	let div7;
    	let li9;
    	let t27;
    	let li10;
    	let t29;
    	let li11;
    	let t31;
    	let li12;
    	let t33;
    	let div15;
    	let div14;
    	let div11;
    	let t35;
    	let div13;
    	let div12;
    	let li13;
    	let t37;
    	let li14;
    	let t39;
    	let li15;
    	let t41;
    	let li16;
    	let t43;
    	let li17;
    	let t45;
    	let li18;
    	let t47;
    	let div20;
    	let div19;
    	let div16;
    	let t49;
    	let div18;
    	let div17;
    	let li19;
    	let t51;
    	let li20;
    	let t53;
    	let li21;
    	let t55;
    	let li22;
    	let t57;
    	let li23;
    	let t59;
    	let li24;
    	let t61;
    	let div25;
    	let div24;
    	let div21;
    	let t63;
    	let div23;
    	let div22;
    	let li25;
    	let t65;
    	let li26;
    	let t67;
    	let li27;
    	let t69;
    	let li28;
    	let t71;
    	let div30;
    	let div29;
    	let div26;
    	let t73;
    	let div28;
    	let div27;
    	let li29;
    	let t75;
    	let li30;
    	let t77;
    	let li31;
    	let t79;
    	let div35;
    	let div34;
    	let div31;
    	let t81;
    	let div33;
    	let div32;
    	let li32;
    	let t83;
    	let li33;
    	let t85;
    	let div40;
    	let div39;
    	let div36;
    	let t87;
    	let div38;
    	let div37;
    	let li34;
    	let t89;
    	let li35;
    	let t91;
    	let li36;
    	let t93;
    	let li37;
    	let t95;
    	let li38;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "Skills";
    			t1 = space();
    			small = element("small");
    			small.textContent = "Categorized by domains.";
    			t3 = space();
    			div41 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div1.textContent = "Languages";
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			li0 = element("li");
    			li0.textContent = "Rust";
    			t7 = space();
    			li1 = element("li");
    			li1.textContent = "Python";
    			t9 = space();
    			li2 = element("li");
    			li2.textContent = "PHP";
    			t11 = space();
    			li3 = element("li");
    			li3.textContent = "Java";
    			t13 = space();
    			li4 = element("li");
    			li4.textContent = "C";
    			t15 = space();
    			li5 = element("li");
    			li5.textContent = "C++";
    			t17 = space();
    			li6 = element("li");
    			li6.textContent = "Golang";
    			t19 = space();
    			li7 = element("li");
    			li7.textContent = "Kotlin";
    			t21 = space();
    			li8 = element("li");
    			li8.textContent = "Javascript";
    			t23 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div6 = element("div");
    			div6.textContent = "Data Science";
    			t25 = space();
    			div8 = element("div");
    			div7 = element("div");
    			li9 = element("li");
    			li9.textContent = "Natural Language Processing";
    			t27 = space();
    			li10 = element("li");
    			li10.textContent = "Computer Vision";
    			t29 = space();
    			li11 = element("li");
    			li11.textContent = "Predictive Analysis";
    			t31 = space();
    			li12 = element("li");
    			li12.textContent = "Transfer Learning";
    			t33 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div11 = element("div");
    			div11.textContent = "Backend";
    			t35 = space();
    			div13 = element("div");
    			div12 = element("div");
    			li13 = element("li");
    			li13.textContent = "NodeJS";
    			t37 = space();
    			li14 = element("li");
    			li14.textContent = "ExpressJS";
    			t39 = space();
    			li15 = element("li");
    			li15.textContent = "Fastify";
    			t41 = space();
    			li16 = element("li");
    			li16.textContent = "Flask";
    			t43 = space();
    			li17 = element("li");
    			li17.textContent = "Go Fiber";
    			t45 = space();
    			li18 = element("li");
    			li18.textContent = "Actix-web";
    			t47 = space();
    			div20 = element("div");
    			div19 = element("div");
    			div16 = element("div");
    			div16.textContent = "Databases";
    			t49 = space();
    			div18 = element("div");
    			div17 = element("div");
    			li19 = element("li");
    			li19.textContent = "Redis";
    			t51 = space();
    			li20 = element("li");
    			li20.textContent = "MongoDB";
    			t53 = space();
    			li21 = element("li");
    			li21.textContent = "MySQL";
    			t55 = space();
    			li22 = element("li");
    			li22.textContent = "Postgres";
    			t57 = space();
    			li23 = element("li");
    			li23.textContent = "OracleDB";
    			t59 = space();
    			li24 = element("li");
    			li24.textContent = "SAP Hana";
    			t61 = space();
    			div25 = element("div");
    			div24 = element("div");
    			div21 = element("div");
    			div21.textContent = "Frontend";
    			t63 = space();
    			div23 = element("div");
    			div22 = element("div");
    			li25 = element("li");
    			li25.textContent = "Svelte";
    			t65 = space();
    			li26 = element("li");
    			li26.textContent = "JQuery";
    			t67 = space();
    			li27 = element("li");
    			li27.textContent = "Bootstrap";
    			t69 = space();
    			li28 = element("li");
    			li28.textContent = "HTML5 / Css3";
    			t71 = space();
    			div30 = element("div");
    			div29 = element("div");
    			div26 = element("div");
    			div26.textContent = "Testing & Automation";
    			t73 = space();
    			div28 = element("div");
    			div27 = element("div");
    			li29 = element("li");
    			li29.textContent = "Selenium";
    			t75 = space();
    			li30 = element("li");
    			li30.textContent = "Postman";
    			t77 = space();
    			li31 = element("li");
    			li31.textContent = "Thunderclient";
    			t79 = space();
    			div35 = element("div");
    			div34 = element("div");
    			div31 = element("div");
    			div31.textContent = "DevOps";
    			t81 = space();
    			div33 = element("div");
    			div32 = element("div");
    			li32 = element("li");
    			li32.textContent = "Git";
    			t83 = space();
    			li33 = element("li");
    			li33.textContent = "Docker";
    			t85 = space();
    			div40 = element("div");
    			div39 = element("div");
    			div36 = element("div");
    			div36.textContent = "Cloud Services";
    			t87 = space();
    			div38 = element("div");
    			div37 = element("div");
    			li34 = element("li");
    			li34.textContent = "AWS";
    			t89 = space();
    			li35 = element("li");
    			li35.textContent = "GCP";
    			t91 = space();
    			li36 = element("li");
    			li36.textContent = "Azure";
    			t93 = space();
    			li37 = element("li");
    			li37.textContent = "Heroku";
    			t95 = space();
    			li38 = element("li");
    			li38.textContent = "Digitalocean";
    			attr_dev(div0, "class", "fs-2 text-white ms-1 mt-2");
    			add_location(div0, file$6, 0, 0, 0);
    			attr_dev(small, "class", "fw-lighter text-white ms-1");
    			add_location(small, file$6, 1, 0, 53);
    			attr_dev(div1, "class", "card-header bg-transparent font-weight-500");
    			add_location(div1, file$6, 5, 9, 341);
    			attr_dev(li0, "class", "col-6");
    			add_location(li0, file$6, 10, 15, 519);
    			attr_dev(li1, "class", "col-6");
    			add_location(li1, file$6, 11, 15, 563);
    			attr_dev(li2, "class", "col-6");
    			add_location(li2, file$6, 12, 15, 609);
    			attr_dev(li3, "class", "col-6");
    			add_location(li3, file$6, 13, 15, 652);
    			attr_dev(li4, "class", "col-6");
    			add_location(li4, file$6, 14, 15, 696);
    			attr_dev(li5, "class", "col-6");
    			add_location(li5, file$6, 15, 15, 737);
    			attr_dev(li6, "class", "col-6");
    			add_location(li6, file$6, 16, 15, 780);
    			attr_dev(li7, "class", "col-6");
    			add_location(li7, file$6, 17, 15, 826);
    			attr_dev(li8, "class", "col-auto");
    			add_location(li8, file$6, 18, 15, 872);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file$6, 9, 12, 485);
    			attr_dev(div3, "class", "card-body");
    			add_location(div3, file$6, 8, 9, 448);
    			attr_dev(div4, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div4, file$6, 4, 6, 255);
    			attr_dev(div5, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div5, file$6, 3, 3, 150);
    			attr_dev(div6, "class", "card-header bg-transparent font-weight-500");
    			add_location(div6, file$6, 25, 9, 1166);
    			attr_dev(li9, "class", "col-12");
    			add_location(li9, file$6, 30, 15, 1347);
    			attr_dev(li10, "class", "col-12");
    			add_location(li10, file$6, 31, 15, 1415);
    			attr_dev(li11, "class", "col-12");
    			add_location(li11, file$6, 32, 15, 1471);
    			attr_dev(li12, "class", "col-12");
    			add_location(li12, file$6, 33, 15, 1531);
    			attr_dev(div7, "class", "row");
    			add_location(div7, file$6, 29, 12, 1313);
    			attr_dev(div8, "class", "card-body");
    			add_location(div8, file$6, 28, 9, 1276);
    			attr_dev(div9, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div9, file$6, 24, 6, 1080);
    			attr_dev(div10, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div10, file$6, 23, 3, 975);
    			attr_dev(div11, "class", "card-header bg-transparent font-weight-500");
    			add_location(div11, file$6, 40, 9, 1830);
    			attr_dev(li13, "class", "col-6");
    			add_location(li13, file$6, 45, 15, 2006);
    			attr_dev(li14, "class", "col-6");
    			add_location(li14, file$6, 46, 15, 2052);
    			attr_dev(li15, "class", "col-6");
    			add_location(li15, file$6, 47, 15, 2101);
    			attr_dev(li16, "class", "col-6");
    			add_location(li16, file$6, 48, 15, 2148);
    			attr_dev(li17, "class", "col-6");
    			add_location(li17, file$6, 49, 15, 2193);
    			attr_dev(li18, "class", "col-auto");
    			add_location(li18, file$6, 50, 15, 2241);
    			attr_dev(div12, "class", "row");
    			add_location(div12, file$6, 44, 12, 1972);
    			attr_dev(div13, "class", "card-body");
    			add_location(div13, file$6, 43, 9, 1935);
    			attr_dev(div14, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div14, file$6, 39, 6, 1744);
    			attr_dev(div15, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div15, file$6, 38, 3, 1639);
    			attr_dev(div16, "class", "card-header bg-transparent font-weight-500");
    			add_location(div16, file$6, 57, 9, 2534);
    			attr_dev(li19, "class", "col-6");
    			add_location(li19, file$6, 62, 15, 2712);
    			attr_dev(li20, "class", "col-6");
    			add_location(li20, file$6, 63, 15, 2757);
    			attr_dev(li21, "class", "col-6");
    			add_location(li21, file$6, 64, 15, 2804);
    			attr_dev(li22, "class", "col-6");
    			add_location(li22, file$6, 65, 15, 2849);
    			attr_dev(li23, "class", "col-6");
    			add_location(li23, file$6, 66, 15, 2897);
    			attr_dev(li24, "class", "col-6");
    			add_location(li24, file$6, 67, 15, 2945);
    			attr_dev(div17, "class", "row");
    			add_location(div17, file$6, 61, 12, 2678);
    			attr_dev(div18, "class", "card-body");
    			add_location(div18, file$6, 60, 9, 2641);
    			attr_dev(div19, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div19, file$6, 56, 6, 2448);
    			attr_dev(div20, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div20, file$6, 55, 3, 2343);
    			attr_dev(div21, "class", "card-header bg-transparent font-weight-500");
    			add_location(div21, file$6, 74, 9, 3234);
    			attr_dev(li25, "class", "col-6");
    			add_location(li25, file$6, 79, 15, 3411);
    			attr_dev(li26, "class", "col-6");
    			add_location(li26, file$6, 80, 15, 3457);
    			attr_dev(li27, "class", "col-auto col-lg-6");
    			add_location(li27, file$6, 81, 15, 3503);
    			attr_dev(li28, "class", "col-auto");
    			add_location(li28, file$6, 82, 15, 3564);
    			attr_dev(div22, "class", "row");
    			add_location(div22, file$6, 78, 12, 3377);
    			attr_dev(div23, "class", "card-body");
    			add_location(div23, file$6, 77, 9, 3340);
    			attr_dev(div24, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div24, file$6, 73, 6, 3148);
    			attr_dev(div25, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div25, file$6, 72, 3, 3043);
    			attr_dev(div26, "class", "card-header bg-transparent font-weight-500");
    			add_location(div26, file$6, 89, 9, 3860);
    			attr_dev(li29, "class", "col-6");
    			add_location(li29, file$6, 94, 15, 4049);
    			attr_dev(li30, "class", "col-6");
    			add_location(li30, file$6, 95, 15, 4097);
    			attr_dev(li31, "class", "col-12");
    			add_location(li31, file$6, 96, 15, 4144);
    			attr_dev(div27, "class", "row");
    			add_location(div27, file$6, 93, 12, 4015);
    			attr_dev(div28, "class", "card-body");
    			add_location(div28, file$6, 92, 9, 3978);
    			attr_dev(div29, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div29, file$6, 88, 6, 3774);
    			attr_dev(div30, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div30, file$6, 87, 3, 3669);
    			attr_dev(div31, "class", "card-header bg-transparent font-weight-500");
    			add_location(div31, file$6, 103, 9, 4439);
    			attr_dev(li32, "class", "col-6");
    			add_location(li32, file$6, 108, 15, 4614);
    			attr_dev(li33, "class", "col-6");
    			add_location(li33, file$6, 109, 15, 4657);
    			attr_dev(div32, "class", "row");
    			add_location(div32, file$6, 107, 12, 4580);
    			attr_dev(div33, "class", "card-body");
    			add_location(div33, file$6, 106, 9, 4543);
    			attr_dev(div34, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div34, file$6, 102, 6, 4353);
    			attr_dev(div35, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div35, file$6, 101, 3, 4248);
    			attr_dev(div36, "class", "card-header bg-transparent font-weight-500");
    			add_location(div36, file$6, 116, 9, 4944);
    			attr_dev(li34, "class", "col-6");
    			add_location(li34, file$6, 121, 15, 5127);
    			attr_dev(li35, "class", "col-6");
    			add_location(li35, file$6, 122, 15, 5170);
    			attr_dev(li36, "class", "col-6");
    			add_location(li36, file$6, 123, 15, 5213);
    			attr_dev(li37, "class", "col-6");
    			add_location(li37, file$6, 124, 15, 5258);
    			attr_dev(li38, "class", "col-12");
    			add_location(li38, file$6, 125, 15, 5304);
    			attr_dev(div37, "class", "row");
    			add_location(div37, file$6, 120, 12, 5093);
    			attr_dev(div38, "class", "card-body");
    			add_location(div38, file$6, 119, 9, 5056);
    			attr_dev(div39, "class", "card border-primary mb-3 mt-2 bg-transparent text-white w-100");
    			add_location(div39, file$6, 115, 6, 4858);
    			attr_dev(div40, "class", "col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch");
    			add_location(div40, file$6, 114, 3, 4753);
    			attr_dev(div41, "class", "row");
    			add_location(div41, file$6, 2, 0, 128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, small, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div41, anchor);
    			append_dev(div41, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, li0);
    			append_dev(div2, t7);
    			append_dev(div2, li1);
    			append_dev(div2, t9);
    			append_dev(div2, li2);
    			append_dev(div2, t11);
    			append_dev(div2, li3);
    			append_dev(div2, t13);
    			append_dev(div2, li4);
    			append_dev(div2, t15);
    			append_dev(div2, li5);
    			append_dev(div2, t17);
    			append_dev(div2, li6);
    			append_dev(div2, t19);
    			append_dev(div2, li7);
    			append_dev(div2, t21);
    			append_dev(div2, li8);
    			append_dev(div41, t23);
    			append_dev(div41, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div6);
    			append_dev(div9, t25);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, li9);
    			append_dev(div7, t27);
    			append_dev(div7, li10);
    			append_dev(div7, t29);
    			append_dev(div7, li11);
    			append_dev(div7, t31);
    			append_dev(div7, li12);
    			append_dev(div41, t33);
    			append_dev(div41, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div11);
    			append_dev(div14, t35);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, li13);
    			append_dev(div12, t37);
    			append_dev(div12, li14);
    			append_dev(div12, t39);
    			append_dev(div12, li15);
    			append_dev(div12, t41);
    			append_dev(div12, li16);
    			append_dev(div12, t43);
    			append_dev(div12, li17);
    			append_dev(div12, t45);
    			append_dev(div12, li18);
    			append_dev(div41, t47);
    			append_dev(div41, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div16);
    			append_dev(div19, t49);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			append_dev(div17, li19);
    			append_dev(div17, t51);
    			append_dev(div17, li20);
    			append_dev(div17, t53);
    			append_dev(div17, li21);
    			append_dev(div17, t55);
    			append_dev(div17, li22);
    			append_dev(div17, t57);
    			append_dev(div17, li23);
    			append_dev(div17, t59);
    			append_dev(div17, li24);
    			append_dev(div41, t61);
    			append_dev(div41, div25);
    			append_dev(div25, div24);
    			append_dev(div24, div21);
    			append_dev(div24, t63);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			append_dev(div22, li25);
    			append_dev(div22, t65);
    			append_dev(div22, li26);
    			append_dev(div22, t67);
    			append_dev(div22, li27);
    			append_dev(div22, t69);
    			append_dev(div22, li28);
    			append_dev(div41, t71);
    			append_dev(div41, div30);
    			append_dev(div30, div29);
    			append_dev(div29, div26);
    			append_dev(div29, t73);
    			append_dev(div29, div28);
    			append_dev(div28, div27);
    			append_dev(div27, li29);
    			append_dev(div27, t75);
    			append_dev(div27, li30);
    			append_dev(div27, t77);
    			append_dev(div27, li31);
    			append_dev(div41, t79);
    			append_dev(div41, div35);
    			append_dev(div35, div34);
    			append_dev(div34, div31);
    			append_dev(div34, t81);
    			append_dev(div34, div33);
    			append_dev(div33, div32);
    			append_dev(div32, li32);
    			append_dev(div32, t83);
    			append_dev(div32, li33);
    			append_dev(div41, t85);
    			append_dev(div41, div40);
    			append_dev(div40, div39);
    			append_dev(div39, div36);
    			append_dev(div39, t87);
    			append_dev(div39, div38);
    			append_dev(div38, div37);
    			append_dev(div37, li34);
    			append_dev(div37, t89);
    			append_dev(div37, li35);
    			append_dev(div37, t91);
    			append_dev(div37, li36);
    			append_dev(div37, t93);
    			append_dev(div37, li37);
    			append_dev(div37, t95);
    			append_dev(div37, li38);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(small);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div41);
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

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* node_modules\svelte-intersection-observer\src\IntersectionObserver.svelte generated by Svelte v3.55.0 */

    const get_default_slot_changes = dirty => ({
    	intersecting: dirty & /*intersecting*/ 1,
    	entry: dirty & /*entry*/ 2,
    	observer: dirty & /*observer*/ 4
    });

    const get_default_slot_context = ctx => ({
    	intersecting: /*intersecting*/ ctx[0],
    	entry: /*entry*/ ctx[1],
    	observer: /*observer*/ ctx[2]
    });

    function create_fragment$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, intersecting, entry, observer*/ 263)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
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
    	validate_slots('IntersectionObserver', slots, ['default']);
    	let { element = null } = $$props;
    	let { once = false } = $$props;
    	let { intersecting = false } = $$props;
    	let { root = null } = $$props;
    	let { rootMargin = "0px" } = $$props;
    	let { threshold = 0 } = $$props;
    	let { entry = null } = $$props;
    	let { observer = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let prevRootMargin = null;
    	let prevElement = null;

    	const initialize = () => {
    		$$invalidate(2, observer = new IntersectionObserver(entries => {
    				entries.forEach(_entry => {
    					$$invalidate(1, entry = _entry);
    					$$invalidate(0, intersecting = _entry.isIntersecting);
    				});
    			},
    		{ root, rootMargin, threshold }));
    	};

    	onMount(() => {
    		initialize();

    		return () => {
    			if (observer) {
    				observer.disconnect();
    				$$invalidate(2, observer = null);
    			}
    		};
    	});

    	afterUpdate(async () => {
    		if (entry !== null) {
    			dispatch("observe", entry);

    			if (entry.isIntersecting) {
    				dispatch("intersect", entry);
    				if (once) observer.unobserve(element);
    			}
    		}

    		await tick();

    		if (element !== null && element !== prevElement) {
    			observer.observe(element);
    			if (prevElement !== null) observer.unobserve(prevElement);
    			prevElement = element;
    		}

    		if (prevRootMargin && rootMargin !== prevRootMargin) {
    			observer.disconnect();
    			prevElement = null;
    			initialize();
    		}

    		prevRootMargin = rootMargin;
    	});

    	const writable_props = [
    		'element',
    		'once',
    		'intersecting',
    		'root',
    		'rootMargin',
    		'threshold',
    		'entry',
    		'observer'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IntersectionObserver> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(3, element = $$props.element);
    		if ('once' in $$props) $$invalidate(4, once = $$props.once);
    		if ('intersecting' in $$props) $$invalidate(0, intersecting = $$props.intersecting);
    		if ('root' in $$props) $$invalidate(5, root = $$props.root);
    		if ('rootMargin' in $$props) $$invalidate(6, rootMargin = $$props.rootMargin);
    		if ('threshold' in $$props) $$invalidate(7, threshold = $$props.threshold);
    		if ('entry' in $$props) $$invalidate(1, entry = $$props.entry);
    		if ('observer' in $$props) $$invalidate(2, observer = $$props.observer);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		element,
    		once,
    		intersecting,
    		root,
    		rootMargin,
    		threshold,
    		entry,
    		observer,
    		tick,
    		createEventDispatcher,
    		afterUpdate,
    		onMount,
    		dispatch,
    		prevRootMargin,
    		prevElement,
    		initialize
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(3, element = $$props.element);
    		if ('once' in $$props) $$invalidate(4, once = $$props.once);
    		if ('intersecting' in $$props) $$invalidate(0, intersecting = $$props.intersecting);
    		if ('root' in $$props) $$invalidate(5, root = $$props.root);
    		if ('rootMargin' in $$props) $$invalidate(6, rootMargin = $$props.rootMargin);
    		if ('threshold' in $$props) $$invalidate(7, threshold = $$props.threshold);
    		if ('entry' in $$props) $$invalidate(1, entry = $$props.entry);
    		if ('observer' in $$props) $$invalidate(2, observer = $$props.observer);
    		if ('prevRootMargin' in $$props) prevRootMargin = $$props.prevRootMargin;
    		if ('prevElement' in $$props) prevElement = $$props.prevElement;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		intersecting,
    		entry,
    		observer,
    		element,
    		once,
    		root,
    		rootMargin,
    		threshold,
    		$$scope,
    		slots
    	];
    }

    class IntersectionObserver_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			element: 3,
    			once: 4,
    			intersecting: 0,
    			root: 5,
    			rootMargin: 6,
    			threshold: 7,
    			entry: 1,
    			observer: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IntersectionObserver_1",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get element() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get once() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set once(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get intersecting() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set intersecting(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get root() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set root(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rootMargin() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rootMargin(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get threshold() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set threshold(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get entry() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entry(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get observer() {
    		throw new Error("<IntersectionObserver>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set observer(value) {
    		throw new Error("<IntersectionObserver>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var IntersectionObserver$1 = IntersectionObserver_1;

    /* src\Projects.svelte generated by Svelte v3.55.0 */
    const file$5 = "src\\Projects.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (23:3) <IntersectionObserver once {element} bind:intersecting threshold={0.5}>
    function create_default_slot(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*project_name*/ ctx[0]);
    			attr_dev(div, "class", "fs-4 my-2");
    			add_location(div, file$5, 23, 6, 799);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			/*div_binding*/ ctx[8](div);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_name*/ 1) set_data_dev(t, /*project_name*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(23:3) <IntersectionObserver once {element} bind:intersecting threshold={0.5}>",
    		ctx
    	});

    	return block;
    }

    // (29:12) {#if intersecting}
    function create_if_block$1(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "class", "rounded-3");
    			attr_dev(iframe, "loading", "lazy");
    			if (!src_url_equal(iframe.src, iframe_src_value = /*project_videolink*/ ctx[2])) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "YouTube video player");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$5, 29, 15, 1049);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_videolink*/ 4 && !src_url_equal(iframe.src, iframe_src_value = /*project_videolink*/ ctx[2])) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(29:12) {#if intersecting}",
    		ctx
    	});

    	return block;
    }

    // (40:12) {#each project_languages as project,i}
    function create_each_block_2(ctx) {
    	let div;
    	let div_aria_label_value;
    	let div_aria_valuenow_value;
    	let div_aria_valuemax_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "progress-bar " + /*palette*/ ctx[7][/*i*/ ctx[12]]['color-name']);
    			attr_dev(div, "aria-label", div_aria_label_value = /*project*/ ctx[10]['language']);
    			attr_dev(div, "role", "progressbar");
    			set_style(div, "width", /*project*/ ctx[10]['percentage'] + "%");
    			attr_dev(div, "aria-valuenow", div_aria_valuenow_value = /*project*/ ctx[10]['percentage']);
    			attr_dev(div, "aria-valuemin", "0");
    			attr_dev(div, "aria-valuemax", div_aria_valuemax_value = /*project*/ ctx[10]['percentage']);
    			add_location(div, file$5, 40, 15, 1625);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_languages*/ 8 && div_aria_label_value !== (div_aria_label_value = /*project*/ ctx[10]['language'])) {
    				attr_dev(div, "aria-label", div_aria_label_value);
    			}

    			if (dirty & /*project_languages*/ 8) {
    				set_style(div, "width", /*project*/ ctx[10]['percentage'] + "%");
    			}

    			if (dirty & /*project_languages*/ 8 && div_aria_valuenow_value !== (div_aria_valuenow_value = /*project*/ ctx[10]['percentage'])) {
    				attr_dev(div, "aria-valuenow", div_aria_valuenow_value);
    			}

    			if (dirty & /*project_languages*/ 8 && div_aria_valuemax_value !== (div_aria_valuemax_value = /*project*/ ctx[10]['percentage'])) {
    				attr_dev(div, "aria-valuemax", div_aria_valuemax_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(40:12) {#each project_languages as project,i}",
    		ctx
    	});

    	return block;
    }

    // (46:12) {#each project_languages as project,i}
    function create_each_block_1$1(ctx) {
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
    	let t1_value = /*project*/ ctx[10]['language'] + "";
    	let t1;
    	let t2;
    	let t3_value = /*project*/ ctx[10]['percentage'] + "";
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
    			add_location(g0, file$5, 48, 334, 2407);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$5, 48, 381, 2454);
    			attr_dev(rect, "id", "Icons");
    			attr_dev(rect, "x", "0");
    			attr_dev(rect, "y", "0");
    			attr_dev(rect, "width", "1280");
    			attr_dev(rect, "height", "800");
    			set_style(rect, "fill", "none");
    			add_location(rect, file$5, 48, 533, 2606);
    			attr_dev(g2, "id", "Strike");
    			add_location(g2, file$5, 48, 648, 2721);
    			attr_dev(g3, "id", "H1");
    			add_location(g3, file$5, 48, 669, 2742);
    			attr_dev(g4, "id", "H2");
    			add_location(g4, file$5, 48, 686, 2759);
    			attr_dev(g5, "id", "H3");
    			add_location(g5, file$5, 48, 703, 2776);
    			attr_dev(g6, "id", "list-ul");
    			add_location(g6, file$5, 48, 720, 2793);
    			attr_dev(g7, "id", "hamburger-1");
    			add_location(g7, file$5, 48, 742, 2815);
    			attr_dev(g8, "id", "hamburger-2");
    			add_location(g8, file$5, 48, 768, 2841);
    			attr_dev(g9, "id", "list-ol");
    			add_location(g9, file$5, 48, 794, 2867);
    			attr_dev(g10, "id", "list-task");
    			add_location(g10, file$5, 48, 816, 2889);
    			attr_dev(g11, "id", "trash");
    			add_location(g11, file$5, 48, 840, 2913);
    			attr_dev(g12, "id", "vertical-menu");
    			add_location(g12, file$5, 48, 860, 2933);
    			attr_dev(g13, "id", "horizontal-menu");
    			add_location(g13, file$5, 48, 888, 2961);
    			attr_dev(g14, "id", "sidebar-2");
    			add_location(g14, file$5, 48, 918, 2991);
    			attr_dev(g15, "id", "Pen");
    			add_location(g15, file$5, 48, 942, 3015);
    			attr_dev(g16, "id", "Pen1");
    			attr_dev(g16, "serif:id", "Pen");
    			add_location(g16, file$5, 48, 960, 3033);
    			attr_dev(g17, "id", "clock");
    			add_location(g17, file$5, 48, 994, 3067);
    			attr_dev(g18, "id", "external-link");
    			add_location(g18, file$5, 48, 1014, 3087);
    			attr_dev(g19, "id", "hr");
    			add_location(g19, file$5, 48, 1042, 3115);
    			attr_dev(g20, "id", "info");
    			add_location(g20, file$5, 48, 1059, 3132);
    			attr_dev(g21, "id", "warning");
    			add_location(g21, file$5, 48, 1078, 3151);
    			attr_dev(g22, "id", "plus-circle");
    			add_location(g22, file$5, 48, 1100, 3173);
    			attr_dev(g23, "id", "minus-circle");
    			add_location(g23, file$5, 48, 1126, 3199);
    			attr_dev(g24, "id", "vue");
    			add_location(g24, file$5, 48, 1153, 3226);
    			attr_dev(g25, "id", "cog");
    			add_location(g25, file$5, 48, 1171, 3244);
    			attr_dev(g26, "id", "logo");
    			add_location(g26, file$5, 48, 1189, 3262);
    			attr_dev(g27, "id", "radio-check");
    			add_location(g27, file$5, 48, 1208, 3281);
    			attr_dev(g28, "id", "eye-slash");
    			add_location(g28, file$5, 48, 1234, 3307);
    			attr_dev(g29, "id", "eye");
    			add_location(g29, file$5, 48, 1258, 3331);
    			attr_dev(g30, "id", "toggle-off");
    			add_location(g30, file$5, 48, 1276, 3349);
    			attr_dev(g31, "id", "shredder");
    			add_location(g31, file$5, 48, 1301, 3374);
    			attr_dev(g32, "id", "spinner--loading--dots-");
    			attr_dev(g32, "serif:id", "spinner [loading, dots]");
    			add_location(g32, file$5, 48, 1324, 3397);
    			attr_dev(g33, "id", "react");
    			add_location(g33, file$5, 48, 1397, 3470);
    			attr_dev(g34, "id", "check-selected");
    			add_location(g34, file$5, 48, 1417, 3490);
    			attr_dev(circle, "cx", "543.992");
    			attr_dev(circle, "cy", "352");
    			attr_dev(circle, "r", "14.13");
    			add_location(circle, file$5, 48, 1527, 3600);
    			attr_dev(g35, "id", "circle-filled");
    			attr_dev(g35, "transform", "matrix(1.70002,0,0,1.70002,-316.778,-246.387)");
    			add_location(g35, file$5, 48, 1446, 3519);
    			attr_dev(g36, "id", "turn-off");
    			add_location(g36, file$5, 48, 1582, 3655);
    			attr_dev(g37, "id", "code-block");
    			add_location(g37, file$5, 48, 1605, 3678);
    			attr_dev(g38, "id", "user");
    			add_location(g38, file$5, 48, 1630, 3703);
    			attr_dev(g39, "id", "coffee-bean");
    			add_location(g39, file$5, 48, 1649, 3722);
    			attr_dev(g40, "id", "coffee-bean1");
    			attr_dev(g40, "serif:id", "coffee-bean");
    			add_location(g40, file$5, 48, 1775, 3848);
    			attr_dev(g41, "id", "coffee-beans");
    			add_location(g41, file$5, 48, 1753, 3826);
    			attr_dev(g42, "transform", "matrix(0.638317,0.368532,-0.368532,0.638317,785.021,-208.975)");
    			add_location(g42, file$5, 48, 1675, 3748);
    			attr_dev(g43, "id", "coffee-bean-filled");
    			add_location(g43, file$5, 48, 1835, 3908);
    			attr_dev(g44, "id", "coffee-bean2");
    			attr_dev(g44, "serif:id", "coffee-bean");
    			add_location(g44, file$5, 48, 1975, 4048);
    			attr_dev(g45, "id", "coffee-beans-filled");
    			add_location(g45, file$5, 48, 1946, 4019);
    			attr_dev(g46, "transform", "matrix(0.638317,0.368532,-0.368532,0.638317,913.062,-208.975)");
    			add_location(g46, file$5, 48, 1868, 3941);
    			attr_dev(g47, "id", "clipboard");
    			add_location(g47, file$5, 48, 2035, 4108);
    			attr_dev(g48, "id", "clipboard-paste");
    			add_location(g48, file$5, 48, 2107, 4180);
    			attr_dev(g49, "transform", "matrix(1,0,0,1,128.011,1.35415)");
    			add_location(g49, file$5, 48, 2059, 4132);
    			attr_dev(g50, "id", "clipboard-copy");
    			add_location(g50, file$5, 48, 2142, 4215);
    			attr_dev(g51, "id", "Layer1");
    			add_location(g51, file$5, 48, 2171, 4244);
    			attr_dev(g52, "id", "Icons1");
    			attr_dev(g52, "serif:id", "Icons");
    			add_location(g52, file$5, 48, 615, 2688);
    			attr_dev(g53, "transform", "matrix(1,0,0,1,-576,-320)");
    			add_location(g53, file$5, 48, 491, 2564);
    			attr_dev(g54, "id", "SVGRepo_iconCarrier");
    			add_location(g54, file$5, 48, 462, 2535);
    			attr_dev(svg, "fill", /*palette*/ ctx[7][/*i*/ ctx[12]]['color']);
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
    			add_location(svg, file$5, 48, 19, 2092);
    			attr_dev(span, "class", "align-bottom");
    			add_location(span, file$5, 49, 19, 4306);
    			add_location(small, file$5, 47, 16, 2064);
    			attr_dev(div, "class", "my-1 me-2");
    			add_location(div, file$5, 46, 12, 2023);
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
    			if (dirty & /*project_languages*/ 8 && t1_value !== (t1_value = /*project*/ ctx[10]['language'] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*project_languages*/ 8 && t3_value !== (t3_value = /*project*/ ctx[10]['percentage'] + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(46:12) {#each project_languages as project,i}",
    		ctx
    	});

    	return block;
    }

    // (58:12) {#each project_links as project,i}
    function create_each_block$1(ctx) {
    	let div;
    	let a;
    	let small;
    	let t0_value = /*project*/ ctx[10]['name'] + "";
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
    			add_location(small, file$5, 60, 18, 4821);
    			attr_dev(a, "type", "button");
    			attr_dev(a, "role", "button");
    			attr_dev(a, "class", "btn btn-sm btn-outline-primary rounded-pill text-white font-weight-300");
    			attr_dev(a, "href", a_href_value = /*project*/ ctx[10]['link']);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noreferrer");
    			add_location(a, file$5, 59, 15, 4635);
    			attr_dev(div, "class", "my-1 me-2");
    			add_location(div, file$5, 58, 12, 4595);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, small);
    			append_dev(small, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*project_links*/ 16 && t0_value !== (t0_value = /*project*/ ctx[10]['name'] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*project_links*/ 16 && a_href_value !== (a_href_value = /*project*/ ctx[10]['link'])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(58:12) {#each project_links as project,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div7;
    	let intersectionobserver;
    	let updating_intersecting;
    	let t0;
    	let div6;
    	let div1;
    	let div0;
    	let t1;
    	let div5;
    	let p;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let div3;
    	let t5;
    	let div4;
    	let t6;
    	let hr;
    	let current;

    	function intersectionobserver_intersecting_binding(value) {
    		/*intersectionobserver_intersecting_binding*/ ctx[9](value);
    	}

    	let intersectionobserver_props = {
    		once: true,
    		element: /*element*/ ctx[5],
    		threshold: 0.5,
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*intersecting*/ ctx[6] !== void 0) {
    		intersectionobserver_props.intersecting = /*intersecting*/ ctx[6];
    	}

    	intersectionobserver = new IntersectionObserver$1({
    			props: intersectionobserver_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(intersectionobserver, 'intersecting', intersectionobserver_intersecting_binding, /*intersecting*/ ctx[6]));
    	let if_block = /*intersecting*/ ctx[6] && create_if_block$1(ctx);
    	let each_value_2 = /*project_languages*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*project_languages*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*project_links*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			create_component(intersectionobserver.$$.fragment);
    			t0 = space();
    			div6 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			div5 = element("div");
    			p = element("p");
    			t2 = text(/*project_description*/ ctx[1]);
    			t3 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t4 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			hr = element("hr");
    			attr_dev(div0, "class", "ratio ratio-16x9");
    			add_location(div0, file$5, 27, 9, 970);
    			attr_dev(div1, "class", "col-lg-6 col-md-12 mb-2");
    			add_location(div1, file$5, 26, 7, 922);
    			attr_dev(p, "class", "lh-lg text-justify");
    			add_location(p, file$5, 34, 10, 1396);
    			attr_dev(div2, "class", "progress rounded my-1");
    			set_style(div2, "height", "5px");
    			add_location(div2, file$5, 38, 9, 1500);
    			attr_dev(div3, "class", "d-flex flex-wrap my-2");
    			add_location(div3, file$5, 44, 10, 1922);
    			attr_dev(div4, "class", "d-flex flex-wrap my-2");
    			add_location(div4, file$5, 56, 10, 4498);
    			attr_dev(div5, "class", "col-lg-6 col-md-12");
    			add_location(div5, file$5, 33, 7, 1352);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$5, 25, 4, 896);
    			attr_dev(div7, "class", "py-2");
    			add_location(div7, file$5, 21, 0, 697);
    			add_location(hr, file$5, 72, 1, 5022);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			mount_component(intersectionobserver, div7, null);
    			append_dev(div7, t0);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, p);
    			append_dev(p, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div2);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div2, null);
    			}

    			append_dev(div5, t4);
    			append_dev(div5, div3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(div5, t5);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			insert_dev(target, t6, anchor);
    			insert_dev(target, hr, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const intersectionobserver_changes = {};
    			if (dirty & /*element*/ 32) intersectionobserver_changes.element = /*element*/ ctx[5];

    			if (dirty & /*$$scope, element, project_name*/ 32801) {
    				intersectionobserver_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_intersecting && dirty & /*intersecting*/ 64) {
    				updating_intersecting = true;
    				intersectionobserver_changes.intersecting = /*intersecting*/ ctx[6];
    				add_flush_callback(() => updating_intersecting = false);
    			}

    			intersectionobserver.$set(intersectionobserver_changes);

    			if (/*intersecting*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*project_description*/ 2) set_data_dev(t2, /*project_description*/ ctx[1]);

    			if (dirty & /*palette, project_languages*/ 136) {
    				each_value_2 = /*project_languages*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*project_languages, palette*/ 136) {
    				each_value_1 = /*project_languages*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div3, null);
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(intersectionobserver.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(intersectionobserver.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(intersectionobserver);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t6);
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

    	let element;
    	let intersecting;

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
    	});

    	const writable_props = [
    		'project_name',
    		'project_description',
    		'project_videolink',
    		'project_languages',
    		'project_links'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	function intersectionobserver_intersecting_binding(value) {
    		intersecting = value;
    		$$invalidate(6, intersecting);
    	}

    	$$self.$$set = $$props => {
    		if ('project_name' in $$props) $$invalidate(0, project_name = $$props.project_name);
    		if ('project_description' in $$props) $$invalidate(1, project_description = $$props.project_description);
    		if ('project_videolink' in $$props) $$invalidate(2, project_videolink = $$props.project_videolink);
    		if ('project_languages' in $$props) $$invalidate(3, project_languages = $$props.project_languages);
    		if ('project_links' in $$props) $$invalidate(4, project_links = $$props.project_links);
    	};

    	$$self.$capture_state = () => ({
    		project_name,
    		project_description,
    		project_videolink,
    		project_languages,
    		project_links,
    		palette,
    		IntersectionObserver: IntersectionObserver$1,
    		element,
    		intersecting
    	});

    	$$self.$inject_state = $$props => {
    		if ('project_name' in $$props) $$invalidate(0, project_name = $$props.project_name);
    		if ('project_description' in $$props) $$invalidate(1, project_description = $$props.project_description);
    		if ('project_videolink' in $$props) $$invalidate(2, project_videolink = $$props.project_videolink);
    		if ('project_languages' in $$props) $$invalidate(3, project_languages = $$props.project_languages);
    		if ('project_links' in $$props) $$invalidate(4, project_links = $$props.project_links);
    		if ('element' in $$props) $$invalidate(5, element = $$props.element);
    		if ('intersecting' in $$props) $$invalidate(6, intersecting = $$props.intersecting);
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
    		element,
    		intersecting,
    		palette,
    		div_binding,
    		intersectionobserver_intersecting_binding
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
    			project_links: 4
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
    }

    /* src\Modal.svelte generated by Svelte v3.55.0 */

    const file$4 = "src\\Modal.svelte";

    function create_fragment$4(ctx) {
    	let div11;
    	let div10;
    	let div9;
    	let div8;
    	let div0;
    	let t1;
    	let small0;
    	let div6;
    	let div1;
    	let input0;
    	let t2;
    	let label0;
    	let t4;
    	let div2;
    	let input1;
    	let t5;
    	let label1;
    	let t7;
    	let div3;
    	let input2;
    	let t8;
    	let label2;
    	let t10;
    	let div4;
    	let input3;
    	let t11;
    	let label3;
    	let t13;
    	let div5;
    	let input4;
    	let t14;
    	let label4;
    	let t16;
    	let hr;
    	let t17;
    	let div7;
    	let button;
    	let small1;

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			div0.textContent = "Domain";
    			t1 = space();
    			small0 = element("small");
    			div6 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t2 = text("\r\n                               ");
    			label0 = element("label");
    			label0.textContent = "AI";
    			t4 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t5 = text("\r\n                               ");
    			label1 = element("label");
    			label1.textContent = "Web";
    			t7 = space();
    			div3 = element("div");
    			input2 = element("input");
    			t8 = text("\r\n                               ");
    			label2 = element("label");
    			label2.textContent = "CLI";
    			t10 = space();
    			div4 = element("div");
    			input3 = element("input");
    			t11 = text("\r\n                               ");
    			label3 = element("label");
    			label3.textContent = "Android";
    			t13 = space();
    			div5 = element("div");
    			input4 = element("input");
    			t14 = text("\r\n                               ");
    			label4 = element("label");
    			label4.textContent = "Windows";
    			t16 = space();
    			hr = element("hr");
    			t17 = space();
    			div7 = element("div");
    			button = element("button");
    			small1 = element("small");
    			small1.textContent = "Apply";
    			attr_dev(div0, "class", "font-weight-500 mb-1");
    			add_location(div0, file$4, 5, 21, 303);
    			attr_dev(input0, "class", "form-check-input");
    			attr_dev(input0, "type", "checkbox");
    			input0.value = "";
    			attr_dev(input0, "id", "ai");
    			add_location(input0, file$4, 11, 30, 556);
    			attr_dev(label0, "for", "ai");
    			add_location(label0, file$4, 12, 36, 659);
    			attr_dev(div1, "class", "col-6 my-1");
    			add_location(div1, file$4, 10, 27, 500);
    			attr_dev(input1, "class", "form-check-input");
    			attr_dev(input1, "type", "checkbox");
    			input1.value = "";
    			attr_dev(input1, "id", "web");
    			add_location(input1, file$4, 15, 30, 805);
    			attr_dev(label1, "for", "web");
    			add_location(label1, file$4, 16, 36, 909);
    			attr_dev(div2, "class", "col-6 my-1");
    			add_location(div2, file$4, 14, 27, 749);
    			attr_dev(input2, "class", "form-check-input");
    			attr_dev(input2, "type", "checkbox");
    			input2.value = "";
    			attr_dev(input2, "id", "cli");
    			add_location(input2, file$4, 19, 30, 1057);
    			attr_dev(label2, "for", "cli");
    			add_location(label2, file$4, 20, 36, 1161);
    			attr_dev(div3, "class", "col-6 my-1");
    			add_location(div3, file$4, 18, 27, 1001);
    			attr_dev(input3, "class", "form-check-input");
    			attr_dev(input3, "type", "checkbox");
    			input3.value = "";
    			attr_dev(input3, "id", "android");
    			add_location(input3, file$4, 23, 30, 1309);
    			attr_dev(label3, "for", "android");
    			add_location(label3, file$4, 24, 36, 1417);
    			attr_dev(div4, "class", "col-6 my-1");
    			add_location(div4, file$4, 22, 27, 1253);
    			attr_dev(input4, "class", "form-check-input");
    			attr_dev(input4, "type", "checkbox");
    			input4.value = "";
    			attr_dev(input4, "id", "windows");
    			add_location(input4, file$4, 27, 30, 1573);
    			attr_dev(label4, "for", "windows");
    			add_location(label4, file$4, 28, 36, 1681);
    			attr_dev(div5, "class", "col-6 my-1");
    			add_location(div5, file$4, 26, 27, 1517);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$4, 9, 24, 454);
    			add_location(small0, file$4, 8, 21, 421);
    			add_location(hr, file$4, 32, 21, 1838);
    			add_location(small1, file$4, 34, 100, 1989);
    			attr_dev(button, "class", "btn btn-sm btn-outline-primary text-white px-4 rounded-pill");
    			add_location(button, file$4, 34, 24, 1913);
    			attr_dev(div7, "class", "text-end");
    			add_location(div7, file$4, 33, 21, 1865);
    			attr_dev(div8, "class", "modal-body mx-2");
    			add_location(div8, file$4, 4, 18, 251);
    			attr_dev(div9, "class", "modal-content bg-custom shadow");
    			add_location(div9, file$4, 3, 15, 187);
    			attr_dev(div10, "class", "modal-dialog modal-dialog-centered");
    			add_location(div10, file$4, 2, 12, 122);
    			attr_dev(div11, "class", "modal fade");
    			attr_dev(div11, "id", "filterModal");
    			attr_dev(div11, "tabindex", "-1");
    			attr_dev(div11, "aria-hidden", "true");
    			add_location(div11, file$4, 1, 9, 34);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div8, t1);
    			append_dev(div8, small0);
    			append_dev(small0, div6);
    			append_dev(div6, div1);
    			append_dev(div1, input0);
    			append_dev(div1, t2);
    			append_dev(div1, label0);
    			append_dev(div6, t4);
    			append_dev(div6, div2);
    			append_dev(div2, input1);
    			append_dev(div2, t5);
    			append_dev(div2, label1);
    			append_dev(div6, t7);
    			append_dev(div6, div3);
    			append_dev(div3, input2);
    			append_dev(div3, t8);
    			append_dev(div3, label2);
    			append_dev(div6, t10);
    			append_dev(div6, div4);
    			append_dev(div4, input3);
    			append_dev(div4, t11);
    			append_dev(div4, label3);
    			append_dev(div6, t13);
    			append_dev(div6, div5);
    			append_dev(div5, input4);
    			append_dev(div5, t14);
    			append_dev(div5, label4);
    			append_dev(div8, t16);
    			append_dev(div8, hr);
    			append_dev(div8, t17);
    			append_dev(div8, div7);
    			append_dev(div7, button);
    			append_dev(button, small1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
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
    	validate_slots('Modal', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\SearchFilter.svelte generated by Svelte v3.55.0 */

    const file$3 = "src\\SearchFilter.svelte";

    function create_fragment$3(ctx) {
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
    			add_location(div0, file$3, 5, 4, 98);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control form-control-sm bg-transparent border-primary rounded-pill me-1 ps-3");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "aria-label", "Recipient's username");
    			add_location(input, file$3, 7, 7, 195);
    			add_location(small, file$3, 10, 13, 597);
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$3, 12, 16, 751);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$3, 13, 16, 816);
    			attr_dev(path, "d", "M4 7H20M6.99994 12H16.9999M10.9999 17H12.9999");
    			attr_dev(path, "stroke", "#ffffff");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$3, 15, 19, 964);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$3, 14, 16, 915);
    			attr_dev(svg, "width", "18px");
    			attr_dev(svg, "height", "18px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$3, 11, 13, 634);
    			attr_dev(span, "class", "px-2");
    			add_location(span, file$3, 9, 10, 563);
    			attr_dev(button, "class", "btn btn-sm btn-primary bg-transparent rounded-pill font-weight-300");
    			attr_dev(button, "data-bs-toggle", "modal");
    			attr_dev(button, "data-bs-target", "#filterModal");
    			add_location(button, file$3, 8, 7, 415);
    			attr_dev(div1, "class", "input-group my-2 w-c-xl-30 w-c-lg-40 w-c-md-60 w-c-sm-100");
    			add_location(div1, file$3, 6, 4, 115);
    			attr_dev(div2, "class", "d-flex justify-content-between");
    			add_location(div2, file$3, 4, 0, 48);
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
    					listen_dev(input, "input", /*input_handler*/ ctx[1], false, false, false)
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { searchTerm: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchFilter",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get searchTerm() {
    		throw new Error("<SearchFilter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchTerm(value) {
    		throw new Error("<SearchFilter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Home.svelte generated by Svelte v3.55.0 */

    const file$2 = "src\\Home.svelte";

    function create_fragment$2(ctx) {
    	let div6;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let t2;
    	let div2;
    	let t4;
    	let div3;
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
    	let t5;
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
    	let t6;
    	let a2;
    	let svg2;
    	let g6;
    	let rect5;
    	let g7;
    	let g8;
    	let path11;
    	let t7;
    	let a3;
    	let svg3;
    	let g9;
    	let g10;
    	let g13;
    	let title0;
    	let t8;
    	let desc;
    	let t9;
    	let defs1;
    	let g12;
    	let g11;
    	let rect6;
    	let path12;
    	let t10;
    	let a4;
    	let svg4;
    	let g14;
    	let rect7;
    	let g15;
    	let g16;
    	let title1;
    	let t11;
    	let path13;
    	let t12;
    	let a5;
    	let svg5;
    	let g17;
    	let rect8;
    	let g18;
    	let g19;
    	let path14;
    	let t13;
    	let a6;
    	let svg6;
    	let g20;
    	let g21;
    	let g22;
    	let rect9;
    	let path15;
    	let t14;
    	let div4;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let div5;
    	let progress_1;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "Suyash Jawale";
    			t2 = space();
    			div2 = element("div");
    			div2.textContent = "Engineer at Tata Consultancy Services";
    			t4 = space();
    			div3 = element("div");
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
    			t5 = space();
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
    			t6 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			g6 = svg_element("g");
    			rect5 = svg_element("rect");
    			g7 = svg_element("g");
    			g8 = svg_element("g");
    			path11 = svg_element("path");
    			t7 = space();
    			a3 = element("a");
    			svg3 = svg_element("svg");
    			g9 = svg_element("g");
    			g10 = svg_element("g");
    			g13 = svg_element("g");
    			title0 = svg_element("title");
    			t8 = text("team-collaboration/version-control/github");
    			desc = svg_element("desc");
    			t9 = text("Created with Sketch.");
    			defs1 = svg_element("defs");
    			g12 = svg_element("g");
    			g11 = svg_element("g");
    			rect6 = svg_element("rect");
    			path12 = svg_element("path");
    			t10 = space();
    			a4 = element("a");
    			svg4 = svg_element("svg");
    			g14 = svg_element("g");
    			rect7 = svg_element("rect");
    			g15 = svg_element("g");
    			g16 = svg_element("g");
    			title1 = svg_element("title");
    			t11 = text("medium");
    			path13 = svg_element("path");
    			t12 = space();
    			a5 = element("a");
    			svg5 = svg_element("svg");
    			g17 = svg_element("g");
    			rect8 = svg_element("rect");
    			g18 = svg_element("g");
    			g19 = svg_element("g");
    			path14 = svg_element("path");
    			t13 = space();
    			a6 = element("a");
    			svg6 = svg_element("svg");
    			g20 = svg_element("g");
    			g21 = svg_element("g");
    			g22 = svg_element("g");
    			rect9 = svg_element("rect");
    			path15 = svg_element("path");
    			t14 = space();
    			div4 = element("div");
    			t15 = text(/*year*/ ctx[2]);
    			t16 = text(" Years, ");
    			t17 = text(/*month*/ ctx[1]);
    			t18 = text(" Months, ");
    			t19 = text(/*day*/ ctx[0]);
    			t20 = text(" Days");
    			t21 = space();
    			div5 = element("div");
    			progress_1 = element("progress");
    			if (!src_url_equal(img.src, img_src_value = "images/suyash.44093981.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "class", "img-fluid rounded-pill profile-photo");
    			attr_dev(img, "alt", "suyash jawale profile photo");
    			add_location(img, file$2, 9, 7, 224);
    			attr_dev(div0, "class", "m-4");
    			add_location(div0, file$2, 7, 4, 144);
    			attr_dev(div1, "class", "display-4 text-white");
    			add_location(div1, file$2, 11, 4, 377);
    			attr_dev(div2, "class", "lh-lg fs-6 text-white");
    			add_location(div2, file$2, 12, 4, 436);
    			attr_dev(rect0, "x", "0");
    			attr_dev(rect0, "y", "0");
    			attr_dev(rect0, "width", "32.00");
    			attr_dev(rect0, "height", "32.00");
    			attr_dev(rect0, "rx", "6.4");
    			attr_dev(rect0, "fill", "#ffffff");
    			attr_dev(rect0, "strokewidth", "0");
    			add_location(rect0, file$2, 17, 166, 853);
    			attr_dev(g0, "id", "SVGRepo_bgCarrier");
    			attr_dev(g0, "stroke-width", "0");
    			add_location(g0, file$2, 17, 122, 809);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$2, 17, 266, 953);
    			attr_dev(path0, "d", "M2 11.9556C2 8.47078 2 6.7284 2.67818 5.39739C3.27473 4.22661 4.22661 3.27473 5.39739 2.67818C6.7284 2 8.47078 2 11.9556 2H20.0444C23.5292 2 25.2716 2 26.6026 2.67818C27.7734 3.27473 28.7253 4.22661 29.3218 5.39739C30 6.7284 30 8.47078 30 11.9556V20.0444C30 23.5292 30 25.2716 29.3218 26.6026C28.7253 27.7734 27.7734 28.7253 26.6026 29.3218C25.2716 30 23.5292 30 20.0444 30H11.9556C8.47078 30 6.7284 30 5.39739 29.3218C4.22661 28.7253 3.27473 27.7734 2.67818 26.6026C2 25.2716 2 23.5292 2 20.0444V11.9556Z");
    			attr_dev(path0, "fill", "white");
    			add_location(path0, file$2, 17, 377, 1064);
    			attr_dev(path1, "d", "M22.0515 8.52295L16.0644 13.1954L9.94043 8.52295V8.52421L9.94783 8.53053V15.0732L15.9954 19.8466L22.0515 15.2575V8.52295Z");
    			attr_dev(path1, "fill", "#EA4335");
    			add_location(path1, file$2, 17, 914, 1601);
    			attr_dev(path2, "d", "M23.6231 7.38639L22.0508 8.52292V15.2575L26.9983 11.459V9.17074C26.9983 9.17074 26.3978 5.90258 23.6231 7.38639Z");
    			attr_dev(path2, "fill", "#FBBC05");
    			add_location(path2, file$2, 17, 1069, 1756);
    			attr_dev(path3, "d", "M22.0508 15.2575V23.9924H25.8428C25.8428 23.9924 26.9219 23.8813 26.9995 22.6513V11.459L22.0508 15.2575Z");
    			attr_dev(path3, "fill", "#34A853");
    			add_location(path3, file$2, 17, 1215, 1902);
    			attr_dev(path4, "d", "M9.94811 24.0001V15.0732L9.94043 15.0669L9.94811 24.0001Z");
    			attr_dev(path4, "fill", "#C5221F");
    			add_location(path4, file$2, 17, 1353, 2040);
    			attr_dev(path5, "d", "M9.94014 8.52404L8.37646 7.39382C5.60179 5.91001 5 9.17692 5 9.17692V11.4651L9.94014 15.0667V8.52404Z");
    			attr_dev(path5, "fill", "#C5221F");
    			add_location(path5, file$2, 17, 1444, 2131);
    			attr_dev(path6, "d", "M9.94043 8.52441V15.0671L9.94811 15.0734V8.53073L9.94043 8.52441Z");
    			attr_dev(path6, "fill", "#C5221F");
    			add_location(path6, file$2, 17, 1579, 2266);
    			attr_dev(path7, "d", "M5 11.4668V22.6591C5.07646 23.8904 6.15673 24.0003 6.15673 24.0003H9.94877L9.94014 15.0671L5 11.4668Z");
    			attr_dev(path7, "fill", "#4285F4");
    			add_location(path7, file$2, 17, 1678, 2365);
    			attr_dev(g2, "id", "SVGRepo_iconCarrier");
    			add_location(g2, file$2, 17, 348, 1035);
    			attr_dev(svg0, "width", "1.96rem");
    			attr_dev(svg0, "height", "1.96rem");
    			attr_dev(svg0, "viewBox", "0 0 32.00 32.00");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file$2, 17, 10, 697);
    			attr_dev(a0, "class", "margin-custom");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "aria-label", "gmail");
    			attr_dev(a0, "href", "mailto:suyashjawale245@gmail.com");
    			add_location(a0, file$2, 16, 7, 585);
    			attr_dev(rect1, "x", "-1.6");
    			attr_dev(rect1, "y", "-1.6");
    			attr_dev(rect1, "width", "35.20");
    			attr_dev(rect1, "height", "35.20");
    			attr_dev(rect1, "rx", "7.04");
    			attr_dev(rect1, "fill", "#ffffff");
    			attr_dev(rect1, "strokewidth", "0");
    			add_location(rect1, file$2, 21, 172, 2846);
    			attr_dev(g3, "id", "SVGRepo_bgCarrier");
    			attr_dev(g3, "stroke-width", "0");
    			add_location(g3, file$2, 21, 128, 2802);
    			attr_dev(g4, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g4, "stroke-linecap", "round");
    			attr_dev(g4, "stroke-linejoin", "round");
    			add_location(g4, file$2, 21, 279, 2953);
    			attr_dev(rect2, "x", "2");
    			attr_dev(rect2, "y", "2");
    			attr_dev(rect2, "width", "28");
    			attr_dev(rect2, "height", "28");
    			attr_dev(rect2, "rx", "6");
    			attr_dev(rect2, "fill", "url(#paint0_radial_87_7153)");
    			add_location(rect2, file$2, 21, 390, 3064);
    			attr_dev(rect3, "x", "2");
    			attr_dev(rect3, "y", "2");
    			attr_dev(rect3, "width", "28");
    			attr_dev(rect3, "height", "28");
    			attr_dev(rect3, "rx", "6");
    			attr_dev(rect3, "fill", "url(#paint1_radial_87_7153)");
    			add_location(rect3, file$2, 21, 481, 3155);
    			attr_dev(rect4, "x", "2");
    			attr_dev(rect4, "y", "2");
    			attr_dev(rect4, "width", "28");
    			attr_dev(rect4, "height", "28");
    			attr_dev(rect4, "rx", "6");
    			attr_dev(rect4, "fill", "url(#paint2_radial_87_7153)");
    			add_location(rect4, file$2, 21, 572, 3246);
    			attr_dev(path8, "d", "M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z");
    			attr_dev(path8, "fill", "white");
    			add_location(path8, file$2, 21, 663, 3337);
    			attr_dev(path9, "fill-rule", "evenodd");
    			attr_dev(path9, "clip-rule", "evenodd");
    			attr_dev(path9, "d", "M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z");
    			attr_dev(path9, "fill", "white");
    			add_location(path9, file$2, 21, 821, 3495);
    			attr_dev(path10, "fill-rule", "evenodd");
    			attr_dev(path10, "clip-rule", "evenodd");
    			attr_dev(path10, "d", "M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z");
    			attr_dev(path10, "fill", "white");
    			add_location(path10, file$2, 21, 1131, 3805);
    			attr_dev(stop0, "stop-color", "#B13589");
    			add_location(stop0, file$2, 21, 2742, 5416);
    			attr_dev(stop1, "offset", "0.79309");
    			attr_dev(stop1, "stop-color", "#C62F94");
    			add_location(stop1, file$2, 21, 2777, 5451);
    			attr_dev(stop2, "offset", "1");
    			attr_dev(stop2, "stop-color", "#8A3AC8");
    			add_location(stop2, file$2, 21, 2829, 5503);
    			attr_dev(radialGradient0, "id", "paint0_radial_87_7153");
    			attr_dev(radialGradient0, "cx", "0");
    			attr_dev(radialGradient0, "cy", "0");
    			attr_dev(radialGradient0, "r", "1");
    			attr_dev(radialGradient0, "gradientUnits", "userSpaceOnUse");
    			attr_dev(radialGradient0, "gradientTransform", "translate(12 23) rotate(-55.3758) scale(25.5196)");
    			add_location(radialGradient0, file$2, 21, 2578, 5252);
    			attr_dev(stop3, "stop-color", "#E0E8B7");
    			add_location(stop3, file$2, 21, 3057, 5731);
    			attr_dev(stop4, "offset", "0.444662");
    			attr_dev(stop4, "stop-color", "#FB8A2E");
    			add_location(stop4, file$2, 21, 3092, 5766);
    			attr_dev(stop5, "offset", "0.71474");
    			attr_dev(stop5, "stop-color", "#E2425C");
    			add_location(stop5, file$2, 21, 3145, 5819);
    			attr_dev(stop6, "offset", "1");
    			attr_dev(stop6, "stop-color", "#E2425C");
    			attr_dev(stop6, "stop-opacity", "0");
    			add_location(stop6, file$2, 21, 3197, 5871);
    			attr_dev(radialGradient1, "id", "paint1_radial_87_7153");
    			attr_dev(radialGradient1, "cx", "0");
    			attr_dev(radialGradient1, "cy", "0");
    			attr_dev(radialGradient1, "r", "1");
    			attr_dev(radialGradient1, "gradientUnits", "userSpaceOnUse");
    			attr_dev(radialGradient1, "gradientTransform", "translate(11 31) rotate(-65.1363) scale(22.5942)");
    			add_location(radialGradient1, file$2, 21, 2893, 5567);
    			attr_dev(stop7, "offset", "0.156701");
    			attr_dev(stop7, "stop-color", "#406ADC");
    			add_location(stop7, file$2, 21, 3454, 6128);
    			attr_dev(stop8, "offset", "0.467799");
    			attr_dev(stop8, "stop-color", "#6A45BE");
    			add_location(stop8, file$2, 21, 3507, 6181);
    			attr_dev(stop9, "offset", "1");
    			attr_dev(stop9, "stop-color", "#6A45BE");
    			attr_dev(stop9, "stop-opacity", "0");
    			add_location(stop9, file$2, 21, 3560, 6234);
    			attr_dev(radialGradient2, "id", "paint2_radial_87_7153");
    			attr_dev(radialGradient2, "cx", "0");
    			attr_dev(radialGradient2, "cy", "0");
    			attr_dev(radialGradient2, "r", "1");
    			attr_dev(radialGradient2, "gradientUnits", "userSpaceOnUse");
    			attr_dev(radialGradient2, "gradientTransform", "translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)");
    			add_location(radialGradient2, file$2, 21, 3278, 5952);
    			add_location(defs0, file$2, 21, 2571, 5245);
    			attr_dev(g5, "id", "SVGRepo_iconCarrier");
    			add_location(g5, file$2, 21, 361, 3035);
    			attr_dev(svg1, "width", "1.96rem");
    			attr_dev(svg1, "height", "1.96rem");
    			attr_dev(svg1, "viewBox", "-1.6 -1.6 35.20 35.20");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$2, 21, 10, 2684);
    			attr_dev(a1, "class", "margin-custom");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "aria-label", "instagram");
    			attr_dev(a1, "rel", "noreferrer");
    			attr_dev(a1, "href", "https://www.instagram.com/suyash.jawale/");
    			add_location(a1, file$2, 20, 7, 2543);
    			attr_dev(rect5, "x", "-1.6");
    			attr_dev(rect5, "y", "-1.6");
    			attr_dev(rect5, "width", "19.20");
    			attr_dev(rect5, "height", "19.20");
    			attr_dev(rect5, "rx", "3.84");
    			attr_dev(rect5, "fill", "#ffffff");
    			attr_dev(rect5, "strokewidth", "0");
    			add_location(rect5, file$2, 25, 172, 6669);
    			attr_dev(g6, "id", "SVGRepo_bgCarrier");
    			attr_dev(g6, "stroke-width", "0");
    			add_location(g6, file$2, 25, 128, 6625);
    			attr_dev(g7, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g7, "stroke-linecap", "round");
    			attr_dev(g7, "stroke-linejoin", "round");
    			add_location(g7, file$2, 25, 279, 6776);
    			attr_dev(path11, "fill", "#0A66C2");
    			attr_dev(path11, "d", "M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z");
    			add_location(path11, file$2, 25, 390, 6887);
    			attr_dev(g8, "id", "SVGRepo_iconCarrier");
    			add_location(g8, file$2, 25, 361, 6858);
    			attr_dev(svg2, "width", "1.96rem");
    			attr_dev(svg2, "height", "1.96rem");
    			attr_dev(svg2, "viewBox", "-1.6 -1.6 19.20 19.20");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "fill", "none");
    			add_location(svg2, file$2, 25, 10, 6507);
    			attr_dev(a2, "class", "margin-custom");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "aria-label", "linkedin");
    			attr_dev(a2, "rel", "noreferrer");
    			attr_dev(a2, "href", "https://www.linkedin.com/in/suyashjawale/");
    			add_location(a2, file$2, 24, 7, 6366);
    			attr_dev(g9, "id", "SVGRepo_bgCarrier");
    			attr_dev(g9, "stroke-width", "0");
    			add_location(g9, file$2, 29, 176, 7730);
    			attr_dev(g10, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g10, "stroke-linecap", "round");
    			attr_dev(g10, "stroke-linejoin", "round");
    			add_location(g10, file$2, 29, 224, 7778);
    			add_location(title0, file$2, 29, 335, 7889);
    			add_location(desc, file$2, 29, 392, 7946);
    			add_location(defs1, file$2, 29, 426, 7980);
    			attr_dev(rect6, "id", "mask");
    			attr_dev(rect6, "stroke", "#ffffff");
    			attr_dev(rect6, "stroke-width", "2");
    			attr_dev(rect6, "fill", "#ffffff");
    			attr_dev(rect6, "x", "-1");
    			attr_dev(rect6, "y", "-1");
    			attr_dev(rect6, "width", "71");
    			attr_dev(rect6, "height", "71");
    			attr_dev(rect6, "rx", "14");
    			add_location(rect6, file$2, 29, 636, 8190);
    			attr_dev(path12, "d", "M58.3067362,21.4281798 C55.895743,17.2972267 52.6253846,14.0267453 48.4948004,11.615998 C44.3636013,9.20512774 39.8535636,8 34.9614901,8 C30.0700314,8 25.5585181,9.20549662 21.4281798,11.615998 C17.2972267,14.0266224 14.0269912,17.2972267 11.615998,21.4281798 C9.20537366,25.5590099 8,30.0699084 8,34.9607523 C8,40.8357654 9.71405782,46.1187277 13.1430342,50.8109917 C16.5716416,55.5036246 21.0008949,58.7507436 26.4304251,60.5527176 C27.0624378,60.6700211 27.5302994,60.5875152 27.8345016,60.3072901 C28.1388268,60.0266961 28.290805,59.6752774 28.290805,59.2545094 C28.290805,59.1842994 28.2847799,58.5526556 28.2730988,57.3588401 C28.2610487,56.1650247 28.2553926,55.1235563 28.2553926,54.2349267 L27.4479164,54.3746089 C26.9330843,54.468919 26.2836113,54.5088809 25.4994975,54.4975686 C24.7157525,54.4866252 23.9021284,54.4044881 23.0597317,54.2517722 C22.2169661,54.1004088 21.4330982,53.749359 20.7075131,53.1993604 C19.982297,52.6493618 19.4674649,51.9294329 19.1631397,51.0406804 L18.8120898,50.2328353 C18.5780976,49.6950097 18.2097104,49.0975487 17.7064365,48.4426655 C17.2031625,47.7871675 16.6942324,47.3427912 16.1794003,47.108799 L15.9336039,46.9328437 C15.7698216,46.815909 15.6178435,46.6748743 15.4773006,46.511215 C15.3368806,46.3475556 15.2317501,46.1837734 15.1615401,46.0197452 C15.0912072,45.855594 15.1494901,45.7209532 15.3370036,45.6153308 C15.5245171,45.5097084 15.8633939,45.4584343 16.3551097,45.4584343 L17.0569635,45.5633189 C17.5250709,45.6571371 18.104088,45.9373622 18.7947525,46.4057156 C19.4850481,46.8737001 20.052507,47.4821045 20.4972521,48.230683 C21.0358155,49.1905062 21.6846737,49.9218703 22.4456711,50.4251443 C23.2060537,50.9284182 23.9727072,51.1796248 24.744894,51.1796248 C25.5170807,51.1796248 26.1840139,51.121096 26.7459396,51.0046532 C27.3072505,50.8875956 27.8338868,50.7116403 28.3256025,50.477771 C28.5362325,48.9090515 29.1097164,47.7039238 30.0455624,46.8615271 C28.7116959,46.721353 27.5124702,46.5102313 26.4472706,46.2295144 C25.3826858,45.9484285 24.2825656,45.4922482 23.1476478,44.8597436 C22.0121153,44.2280998 21.0701212,43.44374 20.3214198,42.5080169 C19.5725954,41.571802 18.9580429,40.3426971 18.4786232,38.821809 C17.9989575,37.300306 17.7590632,35.5451796 17.7590632,33.5559381 C17.7590632,30.7235621 18.6837199,28.3133066 20.5326645,26.3238191 C19.6665366,24.1944035 19.7483048,21.8072644 20.778215,19.1626478 C21.4569523,18.951772 22.4635002,19.1100211 23.7973667,19.6364115 C25.1314792,20.1630477 26.1082708,20.6141868 26.7287253,20.9882301 C27.3491798,21.3621504 27.8463057,21.6790175 28.2208409,21.9360032 C30.3978419,21.3277217 32.644438,21.0235195 34.9612442,21.0235195 C37.2780503,21.0235195 39.5251383,21.3277217 41.7022622,21.9360032 L43.0362517,21.0938524 C43.9484895,20.5319267 45.0257392,20.0169716 46.2654186,19.5488642 C47.5058357,19.0810026 48.4543466,18.9521409 49.1099676,19.1630167 C50.1627483,21.8077563 50.2565666,24.1947724 49.3901927,26.324188 C51.2390143,28.3136755 52.1640399,30.7245457 52.1640399,33.556307 C52.1640399,35.5455485 51.9232849,37.3062081 51.444357,38.8393922 C50.9648143,40.3728223 50.3449746,41.6006975 49.5845919,42.5256002 C48.8233486,43.4503799 47.8753296,44.2285916 46.7404118,44.8601125 C45.6052481,45.4921252 44.504759,45.9483056 43.4401742,46.2293914 C42.3750975,46.5104772 41.1758719,46.7217219 39.8420054,46.8621419 C41.0585683,47.9149226 41.6669728,49.5767225 41.6669728,51.846804 L41.6669728,59.2535257 C41.6669728,59.6742937 41.8132948,60.0255895 42.1061847,60.3063064 C42.3987058,60.5865315 42.8606653,60.6690374 43.492678,60.5516109 C48.922946,58.7498829 53.3521992,55.5026409 56.7806837,50.810008 C60.2087994,46.117744 61.923472,40.8347817 61.923472,34.9597686 C61.9222424,30.0695396 60.7162539,25.5590099 58.3067362,21.4281798 Z");
    			attr_dev(path12, "id", "Shape");
    			attr_dev(path12, "fill", "#000000");
    			add_location(path12, file$2, 29, 755, 8309);
    			attr_dev(g11, "id", "container");
    			attr_dev(g11, "transform", "translate(2.000000, 2.000000)");
    			attr_dev(g11, "fill-rule", "nonzero");
    			add_location(g11, file$2, 29, 555, 8109);
    			attr_dev(g12, "id", "team-collaboration/version-control/github");
    			attr_dev(g12, "stroke", "none");
    			attr_dev(g12, "stroke-width", "1");
    			attr_dev(g12, "fill", "none");
    			attr_dev(g12, "fill-rule", "evenodd");
    			add_location(g12, file$2, 29, 441, 7995);
    			attr_dev(g13, "id", "SVGRepo_iconCarrier");
    			add_location(g13, file$2, 29, 306, 7860);
    			attr_dev(svg3, "width", "1.96rem");
    			attr_dev(svg3, "height", "1.96rem");
    			attr_dev(svg3, "viewBox", "0 0 73 73");
    			attr_dev(svg3, "version", "1.1");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg3, "fill", "#ffffff");
    			add_location(svg3, file$2, 29, 10, 7564);
    			attr_dev(a3, "class", "margin-custom");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "aria-label", "github");
    			attr_dev(a3, "rel", "noreferrer");
    			attr_dev(a3, "href", "https://github.com/suyashjawale");
    			add_location(a3, file$2, 28, 7, 7435);
    			attr_dev(rect7, "x", "-1.6");
    			attr_dev(rect7, "y", "-1.6");
    			attr_dev(rect7, "width", "35.20");
    			attr_dev(rect7, "height", "35.20");
    			attr_dev(rect7, "rx", "7.04");
    			attr_dev(rect7, "fill", "#ffffff");
    			attr_dev(rect7, "strokewidth", "0");
    			add_location(rect7, file$2, 33, 206, 12487);
    			attr_dev(g14, "id", "SVGRepo_bgCarrier");
    			attr_dev(g14, "stroke-width", "0");
    			add_location(g14, file$2, 33, 162, 12443);
    			attr_dev(g15, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g15, "stroke-linecap", "round");
    			attr_dev(g15, "stroke-linejoin", "round");
    			add_location(g15, file$2, 33, 313, 12594);
    			add_location(title1, file$2, 33, 424, 12705);
    			attr_dev(path13, "d", "M30.955 16c0 3.951-0.661 7.166-1.483 7.166s-1.483-3.215-1.483-7.166 0.661-7.166 1.483-7.166 1.483 3.215 1.483 7.166zM27.167 16c0 4.412-1.882 8.001-4.212 8.001s-4.225-3.589-4.225-8.001 1.894-8.001 4.225-8.001 4.212 3.589 4.212 8.001zM17.919 16c-0.014 4.67-3.803 8.45-8.475 8.45-4.68 0-8.475-3.794-8.475-8.475s3.794-8.475 8.475-8.475c2.351 0 4.479 0.957 6.014 2.504l0.001 0.001c1.521 1.531 2.46 3.641 2.46 5.97 0 0.009 0 0.018-0 0.026v-0.001z");
    			add_location(path13, file$2, 33, 446, 12727);
    			attr_dev(g16, "id", "SVGRepo_iconCarrier");
    			add_location(g16, file$2, 33, 395, 12676);
    			attr_dev(svg4, "fill", "#000000");
    			attr_dev(svg4, "width", "1.96rem");
    			attr_dev(svg4, "height", "1.96rem");
    			attr_dev(svg4, "viewBox", "-1.6 -1.6 35.20 35.20");
    			attr_dev(svg4, "version", "1.1");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "stroke", "#000000");
    			add_location(svg4, file$2, 33, 10, 12291);
    			attr_dev(a4, "class", "margin-custom");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "aria-label", "medium");
    			attr_dev(a4, "rel", "noreferrer");
    			attr_dev(a4, "href", "https://medium.com/@suyashjawale");
    			add_location(a4, file$2, 32, 7, 12161);
    			attr_dev(rect8, "x", "-2.08");
    			attr_dev(rect8, "y", "-2.08");
    			attr_dev(rect8, "width", "20.16");
    			attr_dev(rect8, "height", "20.16");
    			attr_dev(rect8, "rx", "4.032");
    			attr_dev(rect8, "fill", "#ffffff");
    			attr_dev(rect8, "strokewidth", "0");
    			add_location(rect8, file$2, 37, 174, 13523);
    			attr_dev(g17, "id", "SVGRepo_bgCarrier");
    			attr_dev(g17, "stroke-width", "0");
    			add_location(g17, file$2, 37, 130, 13479);
    			attr_dev(g18, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g18, "stroke-linecap", "round");
    			attr_dev(g18, "stroke-linejoin", "round");
    			add_location(g18, file$2, 37, 284, 13633);
    			attr_dev(path14, "fill", "#1D9BF0");
    			attr_dev(path14, "d", "M13.567 5.144c.008.123.008.247.008.371 0 3.796-2.889 8.173-8.172 8.173v-.002A8.131 8.131 0 011 12.398a5.768 5.768 0 004.25-1.19 2.876 2.876 0 01-2.683-1.995c.431.083.875.066 1.297-.05A2.873 2.873 0 011.56 6.348v-.036c.4.222.847.345 1.304.36a2.876 2.876 0 01-.89-3.836 8.152 8.152 0 005.92 3 2.874 2.874 0 014.895-2.619 5.763 5.763 0 001.824-.697 2.883 2.883 0 01-1.262 1.588A5.712 5.712 0 0015 3.656a5.834 5.834 0 01-1.433 1.488z");
    			add_location(path14, file$2, 37, 395, 13744);
    			attr_dev(g19, "id", "SVGRepo_iconCarrier");
    			add_location(g19, file$2, 37, 366, 13715);
    			attr_dev(svg5, "width", "1.96rem");
    			attr_dev(svg5, "height", "1.96rem");
    			attr_dev(svg5, "viewBox", "-2.08 -2.08 20.16 20.16");
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "fill", "none");
    			add_location(svg5, file$2, 37, 10, 13359);
    			attr_dev(a5, "class", "margin-custom");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "aria-label", "twitter");
    			attr_dev(a5, "rel", "noreferrer");
    			attr_dev(a5, "href", "https://twitter.com/the_suyash_");
    			add_location(a5, file$2, 36, 7, 13229);
    			attr_dev(g20, "id", "SVGRepo_bgCarrier");
    			attr_dev(g20, "stroke-width", "0");
    			add_location(g20, file$2, 41, 160, 14558);
    			attr_dev(g21, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g21, "stroke-linecap", "round");
    			attr_dev(g21, "stroke-linejoin", "round");
    			add_location(g21, file$2, 41, 208, 14606);
    			attr_dev(rect9, "width", "512");
    			attr_dev(rect9, "height", "512");
    			attr_dev(rect9, "rx", "15%");
    			attr_dev(rect9, "fill", "#f58025");
    			add_location(rect9, file$2, 41, 319, 14717);
    			attr_dev(path15, "stroke", "#ffffff");
    			attr_dev(path15, "stroke-width", "30");
    			attr_dev(path15, "fill", "none");
    			attr_dev(path15, "d", "M293 89l90 120zm-53 50l115 97zm-41 65l136 64zm-23 69l148 31zm-6 68h150zm-45-44v105h241V297");
    			add_location(path15, file$2, 41, 382, 14780);
    			attr_dev(g22, "id", "SVGRepo_iconCarrier");
    			add_location(g22, file$2, 41, 290, 14688);
    			attr_dev(svg6, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg6, "aria-label", "Stack Overflow");
    			attr_dev(svg6, "role", "img");
    			attr_dev(svg6, "viewBox", "0 0 512 512");
    			attr_dev(svg6, "width", "1.96rem");
    			attr_dev(svg6, "height", "1.96rem");
    			attr_dev(svg6, "fill", "#000000");
    			add_location(svg6, file$2, 41, 10, 14408);
    			attr_dev(a6, "class", "margin-custom");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "aria-label", "stackoverflow");
    			attr_dev(a6, "rel", "noreferrer");
    			attr_dev(a6, "href", "https://stackoverflow.com/users/9807249/suyash-jawale");
    			add_location(a6, file$2, 40, 7, 14250);
    			attr_dev(div3, "class", "fs-4 lh-lg text-center mx-0");
    			add_location(div3, file$2, 15, 4, 535);
    			attr_dev(div4, "class", "fs-6 text-white mt-2");
    			add_location(div4, file$2, 44, 4, 14978);
    			progress_1.value = /*$progress*/ ctx[4];
    			attr_dev(progress_1, "class", "w-100");
    			add_location(progress_1, file$2, 48, 7, 15115);
    			attr_dev(div5, "class", "mx-lg-5 mt-3");
    			add_location(div5, file$2, 47, 4, 15080);
    			attr_dev(div6, "class", "text-center");
    			add_location(div6, file$2, 6, 0, 113);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div0, img);
    			append_dev(div6, t0);
    			append_dev(div6, div1);
    			append_dev(div6, t2);
    			append_dev(div6, div2);
    			append_dev(div6, t4);
    			append_dev(div6, div3);
    			append_dev(div3, a0);
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
    			append_dev(div3, t5);
    			append_dev(div3, a1);
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
    			append_dev(div3, t6);
    			append_dev(div3, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, g6);
    			append_dev(g6, rect5);
    			append_dev(svg2, g7);
    			append_dev(svg2, g8);
    			append_dev(g8, path11);
    			append_dev(div3, t7);
    			append_dev(div3, a3);
    			append_dev(a3, svg3);
    			append_dev(svg3, g9);
    			append_dev(svg3, g10);
    			append_dev(svg3, g13);
    			append_dev(g13, title0);
    			append_dev(title0, t8);
    			append_dev(g13, desc);
    			append_dev(desc, t9);
    			append_dev(g13, defs1);
    			append_dev(g13, g12);
    			append_dev(g12, g11);
    			append_dev(g11, rect6);
    			append_dev(g11, path12);
    			append_dev(div3, t10);
    			append_dev(div3, a4);
    			append_dev(a4, svg4);
    			append_dev(svg4, g14);
    			append_dev(g14, rect7);
    			append_dev(svg4, g15);
    			append_dev(svg4, g16);
    			append_dev(g16, title1);
    			append_dev(title1, t11);
    			append_dev(g16, path13);
    			append_dev(div3, t12);
    			append_dev(div3, a5);
    			append_dev(a5, svg5);
    			append_dev(svg5, g17);
    			append_dev(g17, rect8);
    			append_dev(svg5, g18);
    			append_dev(svg5, g19);
    			append_dev(g19, path14);
    			append_dev(div3, t13);
    			append_dev(div3, a6);
    			append_dev(a6, svg6);
    			append_dev(svg6, g20);
    			append_dev(svg6, g21);
    			append_dev(svg6, g22);
    			append_dev(g22, rect9);
    			append_dev(g22, path15);
    			append_dev(div6, t14);
    			append_dev(div6, div4);
    			append_dev(div4, t15);
    			append_dev(div4, t16);
    			append_dev(div4, t17);
    			append_dev(div4, t18);
    			append_dev(div4, t19);
    			append_dev(div4, t20);
    			append_dev(div6, t21);
    			append_dev(div6, div5);
    			append_dev(div5, progress_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*year*/ 4) set_data_dev(t15, /*year*/ ctx[2]);
    			if (dirty & /*month*/ 2) set_data_dev(t17, /*month*/ ctx[1]);
    			if (dirty & /*day*/ 1) set_data_dev(t19, /*day*/ ctx[0]);

    			if (dirty & /*$progress*/ 16) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let $progress,
    		$$unsubscribe_progress = noop,
    		$$subscribe_progress = () => ($$unsubscribe_progress(), $$unsubscribe_progress = subscribe(progress, $$value => $$invalidate(4, $progress = $$value)), progress);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_progress());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let { day } = $$props;
    	let { month } = $$props;
    	let { year } = $$props;
    	let { progress } = $$props;
    	validate_store(progress, 'progress');
    	$$subscribe_progress();

    	$$self.$$.on_mount.push(function () {
    		if (day === undefined && !('day' in $$props || $$self.$$.bound[$$self.$$.props['day']])) {
    			console.warn("<Home> was created without expected prop 'day'");
    		}

    		if (month === undefined && !('month' in $$props || $$self.$$.bound[$$self.$$.props['month']])) {
    			console.warn("<Home> was created without expected prop 'month'");
    		}

    		if (year === undefined && !('year' in $$props || $$self.$$.bound[$$self.$$.props['year']])) {
    			console.warn("<Home> was created without expected prop 'year'");
    		}

    		if (progress === undefined && !('progress' in $$props || $$self.$$.bound[$$self.$$.props['progress']])) {
    			console.warn("<Home> was created without expected prop 'progress'");
    		}
    	});

    	const writable_props = ['day', 'month', 'year', 'progress'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('day' in $$props) $$invalidate(0, day = $$props.day);
    		if ('month' in $$props) $$invalidate(1, month = $$props.month);
    		if ('year' in $$props) $$invalidate(2, year = $$props.year);
    		if ('progress' in $$props) $$subscribe_progress($$invalidate(3, progress = $$props.progress));
    	};

    	$$self.$capture_state = () => ({ day, month, year, progress, $progress });

    	$$self.$inject_state = $$props => {
    		if ('day' in $$props) $$invalidate(0, day = $$props.day);
    		if ('month' in $$props) $$invalidate(1, month = $$props.month);
    		if ('year' in $$props) $$invalidate(2, year = $$props.year);
    		if ('progress' in $$props) $$subscribe_progress($$invalidate(3, progress = $$props.progress));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [day, month, year, progress, $progress];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { day: 0, month: 1, year: 2, progress: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get day() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set day(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get month() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set month(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get year() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set year(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get progress() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progress(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\NotFound.svelte generated by Svelte v3.55.0 */

    const file$1 = "src\\NotFound.svelte";

    function create_fragment$1(ctx) {
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
    			add_location(g0, file$1, 2, 112, 155);
    			attr_dev(g1, "id", "SVGRepo_tracerCarrier");
    			attr_dev(g1, "stroke-linecap", "round");
    			attr_dev(g1, "stroke-linejoin", "round");
    			add_location(g1, file$1, 2, 159, 202);
    			attr_dev(path0, "d", "m60.06 48.5a5.82 5.82 0 0 0 -1.08-3c-1.13-1.75-4.17-3.37-7.88-1.42s-2.1 6.05-2.1 6.05a15.13 15.13 0 0 0 -2.34 1.16c-1.6.92-1.66 1.71-1.66 1.71l-1.63-.21v-2.25a15.72 15.72 0 0 0 3.29-.2c.34-.25.29-5.13 0-6s-3.75-3.75-3.75-3.75 0-5.34-.12-5.88-2.69-2.71-2.79-2.79-.19-15.13-.23-17.92-.38-3.83-.88-4.41-4.83-6.42-7-6.59-3.66 1.54-4.58 2.63-4.58 5.66-5 7.12-.62 20.25-.62 20.25a7.68 7.68 0 0 0 -2.69 1.08c-.92.75-.5 8.25-.5 8.25a16.33 16.33 0 0 0 -2 2.5c-.54 1-.46 5.38-.17 5.59a15.46 15.46 0 0 0 2.88.29 10.56 10.56 0 0 0 .12 1.08 6.19 6.19 0 0 0 .61 1.21l-1.09.17a2.54 2.54 0 0 0 -1-1.54 3.59 3.59 0 0 0 -2.2-.84 4.45 4.45 0 0 0 -.59-1 9 9 0 0 0 -2.06-1.46 13.11 13.11 0 0 0 2.21-2.2c.5-.84-.09-3.8-3.25-4.75a7.41 7.41 0 0 0 -7.3 1.87c-1.5 1.42-1.75 5.5-1.75 5.5a19.2 19.2 0 0 0 -1 2.75c-.45 1.63 1.42 4.13 1.42 4.13a5.62 5.62 0 0 0 1.38 3.5c1.37 1.45 4.62.91 4.62.91a9.46 9.46 0 0 0 2 .25 9 9 0 0 0 2.63-.66c.37-.13 1.58 1 3.41 1.29a13 13 0 0 0 4.63-.63c.54-.12.5.09 1.62.46a3.87 3.87 0 0 0 2.63-.46c.46-.12.87.21 1.75.29s1.37-.95 1.5-.91a6.44 6.44 0 0 1 1 1c.25.29.5.2 1-.21a4 4 0 0 0 .98-1.46 2 2 0 0 0 1.58.75c.92-.08 3.38.79 4.58.75a10.41 10.41 0 0 0 2.84-.67c.75-.2 2.41.38 3.25.55a8 8 0 0 0 2.71-.38c1.16-.21 3 .67 5.12.71a4.67 4.67 0 0 0 3.44-1.71 2.61 2.61 0 0 0 1.71.54c1.12 0 3-1 4.2-5.08a5.23 5.23 0 0 0 -1.85-5.96zm-54-7.83c.21.08 2-1.46 4.21-1.79a8.15 8.15 0 0 1 4.67 1.12 5.91 5.91 0 0 0 .54-1.58c-.09-.25-1.71-1.5-5-1.21a8.88 8.88 0 0 0 -5.17 2.08c-.17.17.58 1.29.79 1.38zm42.94 1.62c.21.09 2-1.46 4.21-1.79a8.16 8.16 0 0 1 4.62 1.13 5.66 5.66 0 0 0 .56-1.63c-.08-.25-1.7-1.5-5-1.21a8.92 8.92 0 0 0 -5.16 2.09c-.17.2.58 1.33.77 1.41zm-28.9-15.75c.25-.12 0-8.66 0-8.83s-1.18-.19-1.33 0c-.29.46.13 8.63.25 8.79s.83.17 1.08.04zm23 4.46c.17-.08.38-10 .21-10.46s-1.09-.38-1.29-.08c-.08.12-.25 10.25-.13 10.5s1.05.12 1.21.04z");
    			attr_dev(path0, "fill", "#1d1d1b");
    			add_location(path0, file$1, 2, 269, 312);
    			attr_dev(path1, "d", "m25.31 11.75c-.15-.15 4.13-7 6.08-6.92s6.5 7 6.09 7.17-1.75-1.37-6.21-.83-5.71.83-5.96.58z");
    			attr_dev(path1, "fill", "#e6e4da");
    			add_location(path1, file$1, 2, 2136, 2179);
    			attr_dev(path2, "d", "m27.85 9.67a8.87 8.87 0 0 1 2.25-2.5c.38 0 .79.29.67.54a19.24 19.24 0 0 1 -2.08 2.46c-.13-.04-.84-.29-.84-.5z");
    			attr_dev(path2, "fill", "#1d1d1b");
    			add_location(path2, file$1, 2, 2260, 2303);
    			attr_dev(path3, "d", "m24.27 13.75c.23-.28 1.37-1.25 6-1.33s7.33 1 7.37 1.12.34 19.34.5 19.54 2.59 1.92 2.71 2.42a15.6 15.6 0 0 1 .09 3.33 13.86 13.86 0 0 1 -2.94-2.7c-.58-1-1.46-6.55-1.5-9.84s-.13-9.16-4.79-9.46-5.4 4.17-5.71 8.38-.71 11.33-.88 11.54-5 4.21-5 3.92 0-5.38.42-5.63 2.83-.54 2.88-.91.06-19.42.85-20.38z");
    			attr_dev(path3, "fill", "#696a9b");
    			add_location(path3, file$1, 2, 2403, 2446);
    			attr_dev(path4, "d", "m31.23 18.42c1.21 0 3.71 1.33 3.66 5.91s.25 18.75.25 18.75a9.1 9.1 0 0 0 -2-.87c-.13.12-.59.62-.38.75a11.86 11.86 0 0 1 2.38 1.29c.08.29.2 1.38.08 1.38s-2.38-1.71-2.5-1.55-.46.75-.25.88 2.62 1.46 2.71 1.92.12 1.16.12 1.16-3.12-2.5-3.33-2.25-.58.5-.38.67a37.79 37.79 0 0 1 3.71 2.79 1.46 1.46 0 0 1 -.29.63 39.19 39.19 0 0 0 -3.71-2.55c-.12.13-.58.42-.33.63s2.83 2.25 2.71 2.29-4 .13-5.25 0-1.88-.83-1.92-1.71.46-16.21.71-20.37.17-9.88 4.01-9.75z");
    			attr_dev(path4, "fill", "#cbe7f5");
    			add_location(path4, file$1, 2, 2732, 2775);
    			attr_dev(path5, "d", "m29.35 20.13a2.36 2.36 0 0 1 3.79.25c1.09 1.66.8 5.95.46 6.12s-4.5.42-4.91-.21-.21-5.29.66-6.16z");
    			attr_dev(path5, "fill", "#1d1d1b");
    			add_location(path5, file$1, 2, 3211, 3254);
    			attr_dev(path6, "d", "m31.19 20.29c.79-.05 1.45.71 1.54 2.67s0 2.58-.09 2.58-2.58.29-2.83 0-.5-5.12 1.38-5.25z");
    			attr_dev(path6, "fill", "#ffe19b");
    			add_location(path6, file$1, 2, 3341, 3384);
    			attr_dev(path7, "d", "m35.06 13.46c.42-.05 2.17.58 2.13.83s0 .54-.13.54-2.29-.37-2.29-.62-.04-.71.29-.75z");
    			attr_dev(path7, "fill", "#1d1d1b");
    			add_location(path7, file$1, 2, 3463, 3506);
    			attr_dev(path8, "d", "m35.06 15c.42-.05 2.17.58 2.13.83s0 .55-.13.55-2.29-.38-2.29-.63-.04-.75.29-.75z");
    			attr_dev(path8, "fill", "#1d1d1b");
    			add_location(path8, file$1, 2, 3580, 3623);
    			attr_dev(path9, "d", "m35.81 16.79c.42-.05 1.38.38 1.33.63s0 .54-.12.54-1.5-.17-1.5-.42-.04-.71.29-.75z");
    			attr_dev(path9, "fill", "#1d1d1b");
    			add_location(path9, file$1, 2, 3694, 3737);
    			attr_dev(path10, "d", "m24.69 39.46-.05 7.67s-.58-.92-2.75-.55-2.91 1.3-3 1.63.09 1.46-.08 1.46a7.55 7.55 0 0 1 -.79-.13s-.38-3 0-3.91 5.79-5.75 6.67-6.17z");
    			attr_dev(path10, "fill", "#cbe7f5");
    			add_location(path10, file$1, 2, 3809, 3852);
    			attr_dev(path11, "d", "m37.19 38.71c.19-.17 5.33 4.25 6 4.71s1.45 1.25 1.5 1.71a24.12 24.12 0 0 1 -.09 4c-.16 0-.79-.09-.79-.09s.08-1.71-.12-1.87a6.48 6.48 0 0 0 -3.59-.67 1.94 1.94 0 0 0 -1.79 1.63c0 .25.13 1.37 0 1.37s-1 .08-1 0-.46-10.5-.12-10.79z");
    			attr_dev(path11, "fill", "#cbe7f5");
    			add_location(path11, file$1, 2, 3975, 4018);
    			attr_dev(path12, "d", "m19.94 49.5s-.17-1.08.08-1.29a4.63 4.63 0 0 1 2.37-.58c1.13 0 1.59.2 1.59.45s0 1.59-.13 1.67-3.5-.25-3.91-.25z");
    			attr_dev(path12, "fill", "#85bfe9");
    			add_location(path12, file$1, 2, 4236, 4279);
    			attr_dev(path13, "d", "m39.48 49.25s-.09-1.29.21-1.42a8 8 0 0 1 3 .25 4.58 4.58 0 0 1 0 1.34z");
    			attr_dev(path13, "fill", "#85bfe9");
    			add_location(path13, file$1, 2, 4380, 4423);
    			attr_dev(path14, "d", "m25.19 50.92c.16 0 1 .46 1.29.58a6.47 6.47 0 0 0 .71.25l-.09 1-1.87-.16z");
    			attr_dev(path14, "fill", "#696a9b");
    			add_location(path14, file$1, 2, 4484, 4527);
    			attr_dev(path15, "d", "m35.6 51.79s.92 0 1.25-.46a2.14 2.14 0 0 0 .38-.79l.79.21v1.46h-2.42z");
    			attr_dev(path15, "fill", "#696a9b");
    			add_location(path15, file$1, 2, 4590, 4633);
    			attr_dev(path16, "d", "m39.31 50.25a10.32 10.32 0 0 1 3 .25 12.51 12.51 0 0 1 0 3 9.91 9.91 0 0 0 -1.54 1.33c-.34.46-.13.63-.34.46a4.21 4.21 0 0 1 -1.12-1.54 32.7 32.7 0 0 1 0-3.5z");
    			attr_dev(path16, "fill", "#fab900");
    			add_location(path16, file$1, 2, 4693, 4736);
    			attr_dev(path17, "d", "m20.77 50.71a11.08 11.08 0 0 1 2.12 0c.71 0 1.3.29 1.38.79a5.75 5.75 0 0 1 -.54 2.71c-.38.46-.84 1.08-.88.92a15.21 15.21 0 0 0 -1.66-1.63 1.68 1.68 0 0 1 -.42-.5s-.5-1.79 0-2.29z");
    			attr_dev(path17, "fill", "#fab900");
    			add_location(path17, file$1, 2, 4884, 4927);
    			attr_dev(path18, "d", "m39.89 50.92.5.08.13 2.42s-.67 0-.63-.17 0-2.33 0-2.33z");
    			add_location(path18, file$1, 2, 5115, 5158);
    			attr_dev(path19, "d", "m41 50.79.5.09.12 2.41s-.66 0-.62-.16 0-2.34 0-2.34z");
    			add_location(path19, file$1, 2, 5189, 5232);
    			attr_dev(path20, "d", "m22.69 51.29.5.09.12 2.41s-.67 0-.62-.16 0-2.34 0-2.34z");
    			add_location(path20, file$1, 2, 5260, 5303);
    			attr_dev(path21, "d", "m21.52 51.25c.21 0 .5-.08.54.13s.21 1.54 0 1.54a2.35 2.35 0 0 1 -.62-.17z");
    			add_location(path21, file$1, 2, 5334, 5377);
    			attr_dev(g2, "fill", "#1d1d1b");
    			add_location(g2, file$1, 2, 5096, 5139);
    			attr_dev(path22, "d", "m25 53.58 2 .13a3.52 3.52 0 0 0 .79 3c1.21 1.71 1.75 2 1.71 2.29a1.1 1.1 0 0 1 -.92.75c-.5.08-1.21-.79-2.29-.42a17.32 17.32 0 0 1 -2.17.59 5.18 5.18 0 0 0 -2.66-.63c-1.09.21-2.71 1-4.8.42s-2-1.17-3.2-.84a7.87 7.87 0 0 1 -2.34.42c-.33 0-.58 0-.46-.08a3.87 3.87 0 0 0 .63-1.34c-.08-.12-.33-.54-.46-.33a3.14 3.14 0 0 1 -1.37 1.25c-.63.17-2.8.25-3.88-1.12a3 3 0 0 1 -.27-3.67c.54-.5 1.5-1.08 1.54-1.21s-.62-.58-.62-.58-1.38-.08-1.42.13-.83 2.12-1 2a3.35 3.35 0 0 1 -.81-2.34 7.06 7.06 0 0 1 .62-2.13 2.8 2.8 0 0 0 1.46 1.46c1 .29 1.13.17 1.13.17s-2.34-2-1.84-4.25 1.63-4.37 3.9-4.67 5.5.55 5.42 2.38a4.12 4.12 0 0 1 -2.59 3.25 11.66 11.66 0 0 0 -2.33.37 2.29 2.29 0 0 0 -1.17 1.3 5.58 5.58 0 0 0 1.17.37c.17 0-.13-.87 1.42-.87s3.45.62 3.66 1.79a3.41 3.41 0 0 1 -.54 2.25s.83 1 1.33 1 .92-.71 1.17-1a5.31 5.31 0 0 0 .54-1.29s1.54.7 1.46 1.41-.5 1.21-.42 1.34 1 .54 1.3.29a2.33 2.33 0 0 1 2.58-.17c1 .71 1 1.87 1.21 2s1.41-.54 2-1.79a7.74 7.74 0 0 0 .52-1.63z");
    			attr_dev(path22, "fill", "#e6e4da");
    			add_location(path22, file$1, 2, 5431, 5474);
    			attr_dev(path23, "d", "m28.14 52h1.5a2.7 2.7 0 0 0 0 2.67c.79 1.37 1.54 1.62 1.63 2s2.33-1 2.41-2.38a3.28 3.28 0 0 0 -.37-2l1 .13s1.16 2.66.08 4-3.16 2.25-3.45 2.58-.55-1.12-1.67-2.41a4.48 4.48 0 0 1 -1.13-4.59z");
    			attr_dev(path23, "fill", "#ffe19b");
    			add_location(path23, file$1, 2, 6418, 6461);
    			attr_dev(path24, "d", "m31.23 51.46a1.43 1.43 0 0 1 1.46 2 7.32 7.32 0 0 1 -1.34 2.29 3.57 3.57 0 0 1 -1.12-2.58 2.32 2.32 0 0 1 1-1.71z");
    			attr_dev(path24, "fill", "#fab900");
    			add_location(path24, file$1, 2, 6640, 6683);
    			attr_dev(path25, "d", "m35.85 53.46h1.92a4.92 4.92 0 0 0 1.29 2c1 1 .83 1.63 1.25 1.92s.83.33 1 0a4.08 4.08 0 0 1 .92-2.17 7.8 7.8 0 0 1 1.21-1.21l1.66.29s1 1.42 1.67 1.42a1.57 1.57 0 0 0 1.08-.62s-1.62-.75-1.16-1.88a5.18 5.18 0 0 1 5.2-2.42 5.6 5.6 0 0 1 4.55 4.55 3.7 3.7 0 0 1 -3.09 3.87c-2.16.33-4.58-.83-6.12-.46s-.92.63-2.13.5-1.91-.66-3.12-.62-2.92 1-3.5.87a7.71 7.71 0 0 0 -2.84-.66c-1.12.12-1.66.2-1.66.2s-.84-.33-.79-.45 2.33-1 2.5-2.67.16-2.46.16-2.46z");
    			attr_dev(path25, "fill", "#e6e4da");
    			add_location(path25, file$1, 2, 6787, 6830);
    			attr_dev(path26, "d", "m50.23 49.63a3.32 3.32 0 0 1 .25-3.84c1.41-1.5 4.79-1.79 6.52-.79s2.58 5.46 2.37 6.58a3.11 3.11 0 0 1 -1.12 1.8s.12.58.33.62 1-.58 1.34-1.25a11 11 0 0 0 .45-2.67 3.76 3.76 0 0 1 .75 4.05 9.63 9.63 0 0 1 -2.79 4 4.66 4.66 0 0 1 -1.46.29s2.09-3.17-.29-6a6.88 6.88 0 0 0 -6.35-2.79z");
    			attr_dev(path26, "fill", "#e6e4da");
    			add_location(path26, file$1, 2, 7261, 7304);
    			attr_dev(g3, "id", "SVGRepo_iconCarrier");
    			add_location(g3, file$1, 2, 240, 283);
    			attr_dev(svg, "width", "10rem");
    			attr_dev(svg, "height", "10rem");
    			attr_dev(svg, "viewBox", "0 0 64 64");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#000000");
    			add_location(svg, file$1, 2, 8, 51);
    			add_location(div0, file$1, 1, 4, 36);
    			add_location(div1, file$1, 4, 4, 7645);
    			attr_dev(div2, "class", "text-center my-5");
    			add_location(div2, file$1, 0, 0, 0);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    let uid=1;
    const project_list = [
        {
          "id":uid++,
          "name": "ModelX",
          "videolink": "https://www.youtube.com/embed/REaH5dWNINM",
          "description":"ModelX is an android app used to assign name to the products. A simple way to catalog products. ModelX uses the simple principle of CLICK & EDIT. Just click the product photo, enter the product name and done. Check out the pic in the gallery.",
          "languages":[
            {
              "language":"Kotlin",
              "percentage":"100"
            }
          ],
          "links" : [
            {
              "link":"https://play.google.com/store/apps/details?id=com.tech.modelx",
              "name":"Google Play"
            }
          ]
        },
        {
          "id":uid++,
          "name": "InstagramCLI",
          "videolink": "https://www.youtube.com/embed/REaH5dWNINM",
          "description":"ModelX is an android app used to assign name to the products. A simple way to catalog products. ModelX uses the simple principle of CLICK & EDIT. Just click the product photo, enter the product name and done. Check out the pic in the gallery.",
          "languages":[
            {
              "language":"Python",
              "percentage":"10"
            }
          ],
          "links" : [
            {
              "link":"https://play.google.com/store/apps/details?id=com.tech.modelx",
              "name":"Google Play"
            }
          ]
        }
      ];

    /* src\App.svelte generated by Svelte v3.55.0 */
    const file = "src\\App.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (91:6) {:else}
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
    				each_blocks[i].m(target, anchor);
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
    		source: "(91:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:44) 
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*filteredProjects*/ ctx[2];
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
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filteredProjects*/ 4) {
    				each_value = /*filteredProjects*/ ctx[2];
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(87:44) ",
    		ctx
    	});

    	return block;
    }

    // (85:6) {#if searchTerm && filteredProjects.length === 0}
    function create_if_block(ctx) {
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(85:6) {#if searchTerm && filteredProjects.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (92:10) {#each project_list as project}
    function create_each_block_1(ctx) {
    	let projects;
    	let current;

    	projects = new Projects({
    			props: {
    				project_name: /*project*/ ctx[12]['name'],
    				project_description: /*project*/ ctx[12]['description'],
    				project_videolink: /*project*/ ctx[12]['videolink'],
    				project_languages: /*project*/ ctx[12]['languages'],
    				project_links: /*project*/ ctx[12]['links']
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
    		source: "(92:10) {#each project_list as project}",
    		ctx
    	});

    	return block;
    }

    // (88:10) {#each filteredProjects as project}
    function create_each_block(ctx) {
    	let projects;
    	let current;

    	projects = new Projects({
    			props: {
    				project_name: /*project*/ ctx[12]['name'],
    				project_description: /*project*/ ctx[12]['description'],
    				project_videolink: /*project*/ ctx[12]['videolink'],
    				project_languages: /*project*/ ctx[12]['languages'],
    				project_links: /*project*/ ctx[12]['links']
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
    			if (dirty & /*filteredProjects*/ 4) projects_changes.project_name = /*project*/ ctx[12]['name'];
    			if (dirty & /*filteredProjects*/ 4) projects_changes.project_description = /*project*/ ctx[12]['description'];
    			if (dirty & /*filteredProjects*/ 4) projects_changes.project_videolink = /*project*/ ctx[12]['videolink'];
    			if (dirty & /*filteredProjects*/ 4) projects_changes.project_languages = /*project*/ ctx[12]['languages'];
    			if (dirty & /*filteredProjects*/ 4) projects_changes.project_links = /*project*/ ctx[12]['links'];
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
    		source: "(88:10) {#each filteredProjects as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let navbar;
    	let t0;
    	let div2;
    	let section0;
    	let home;
    	let t1;
    	let section1;
    	let div0;
    	let t3;
    	let experience;
    	let t4;
    	let education;
    	let t5;
    	let section2;
    	let skills;
    	let t6;
    	let section3;
    	let div1;
    	let t8;
    	let searchfilter;
    	let updating_searchTerm;
    	let t9;
    	let current_block_type_index;
    	let if_block;
    	let t10;
    	let modal;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	home = new Home({
    			props: {
    				day: /*age*/ ctx[1][2],
    				month: /*age*/ ctx[1][1],
    				year: /*age*/ ctx[1][0],
    				progress: /*progress*/ ctx[4]
    			},
    			$$inline: true
    		});

    	experience = new Experience({
    			props: {
    				years: /*exp*/ ctx[0][0],
    				months: /*exp*/ ctx[0][1]
    			},
    			$$inline: true
    		});

    	education = new Education({ $$inline: true });
    	skills = new Skills({ $$inline: true });

    	function searchfilter_searchTerm_binding(value) {
    		/*searchfilter_searchTerm_binding*/ ctx[6](value);
    	}

    	let searchfilter_props = {};

    	if (/*searchTerm*/ ctx[3] !== void 0) {
    		searchfilter_props.searchTerm = /*searchTerm*/ ctx[3];
    	}

    	searchfilter = new SearchFilter({
    			props: searchfilter_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(searchfilter, 'searchTerm', searchfilter_searchTerm_binding, /*searchTerm*/ ctx[3]));
    	searchfilter.$on("input", /*searchProjects*/ ctx[5]);
    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*searchTerm*/ ctx[3] && /*filteredProjects*/ ctx[2].length === 0) return 0;
    		if (/*filteredProjects*/ ctx[2].length > 0) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	modal = new Modal({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			section0 = element("section");
    			create_component(home.$$.fragment);
    			t1 = space();
    			section1 = element("section");
    			div0 = element("div");
    			div0.textContent = "Experience";
    			t3 = space();
    			create_component(experience.$$.fragment);
    			t4 = space();
    			create_component(education.$$.fragment);
    			t5 = space();
    			section2 = element("section");
    			create_component(skills.$$.fragment);
    			t6 = space();
    			section3 = element("section");
    			div1 = element("div");
    			div1.textContent = "Projects";
    			t8 = space();
    			create_component(searchfilter.$$.fragment);
    			t9 = space();
    			if_block.c();
    			t10 = space();
    			create_component(modal.$$.fragment);
    			attr_dev(section0, "id", "home");
    			attr_dev(section0, "class", "pt-5");
    			add_location(section0, file, 66, 4, 1832);
    			attr_dev(div0, "class", "fs-2 text-white ms-1 my-2");
    			add_location(div0, file, 71, 6, 1998);
    			attr_dev(section1, "id", "about");
    			attr_dev(section1, "class", "mt-3");
    			add_location(section1, file, 70, 4, 1957);
    			attr_dev(section2, "id", "skills");
    			add_location(section2, file, 76, 4, 2151);
    			attr_dev(div1, "class", "fs-2");
    			add_location(div1, file, 81, 6, 2274);
    			attr_dev(section3, "id", "projects");
    			attr_dev(section3, "class", "my-2 text-white my-2");
    			add_location(section3, file, 80, 4, 2214);
    			attr_dev(div2, "class", "container mb-5");
    			add_location(div2, file, 65, 2, 1798);
    			add_location(main, file, 63, 0, 1774);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t0);
    			append_dev(main, div2);
    			append_dev(div2, section0);
    			mount_component(home, section0, null);
    			append_dev(div2, t1);
    			append_dev(div2, section1);
    			append_dev(section1, div0);
    			append_dev(section1, t3);
    			mount_component(experience, section1, null);
    			append_dev(section1, t4);
    			mount_component(education, section1, null);
    			append_dev(div2, t5);
    			append_dev(div2, section2);
    			mount_component(skills, section2, null);
    			append_dev(div2, t6);
    			append_dev(div2, section3);
    			append_dev(section3, div1);
    			append_dev(section3, t8);
    			mount_component(searchfilter, section3, null);
    			append_dev(section3, t9);
    			if_blocks[current_block_type_index].m(section3, null);
    			append_dev(section3, t10);
    			mount_component(modal, section3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const home_changes = {};
    			if (dirty & /*age*/ 2) home_changes.day = /*age*/ ctx[1][2];
    			if (dirty & /*age*/ 2) home_changes.month = /*age*/ ctx[1][1];
    			if (dirty & /*age*/ 2) home_changes.year = /*age*/ ctx[1][0];
    			home.$set(home_changes);
    			const experience_changes = {};
    			if (dirty & /*exp*/ 1) experience_changes.years = /*exp*/ ctx[0][0];
    			if (dirty & /*exp*/ 1) experience_changes.months = /*exp*/ ctx[0][1];
    			experience.$set(experience_changes);
    			const searchfilter_changes = {};

    			if (!updating_searchTerm && dirty & /*searchTerm*/ 8) {
    				updating_searchTerm = true;
    				searchfilter_changes.searchTerm = /*searchTerm*/ ctx[3];
    				add_flush_callback(() => updating_searchTerm = false);
    			}

    			searchfilter.$set(searchfilter_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(section3, t10);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(home.$$.fragment, local);
    			transition_in(experience.$$.fragment, local);
    			transition_in(education.$$.fragment, local);
    			transition_in(skills.$$.fragment, local);
    			transition_in(searchfilter.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(home.$$.fragment, local);
    			transition_out(experience.$$.fragment, local);
    			transition_out(education.$$.fragment, local);
    			transition_out(skills.$$.fragment, local);
    			transition_out(searchfilter.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(home);
    			destroy_component(experience);
    			destroy_component(education);
    			destroy_component(skills);
    			destroy_component(searchfilter);
    			if_blocks[current_block_type_index].d();
    			destroy_component(modal);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let now = new Date();
    	let currentYear = now.getFullYear();
    	let currentMonth = now.getMonth();
    	let currentDate = now.getDate();
    	const progress = tweened(0, { duration: 6000 });

    	function calculate_difference(dobYear, dobMonth, dobDate) {
    		let yearAge = currentYear - dobYear;

    		if (currentMonth >= dobMonth) var monthAge = currentMonth - dobMonth; else {
    			yearAge--;
    			var monthAge = 12 + currentMonth - dobMonth;
    		}

    		if (currentDate >= dobDate) var dateAge = currentDate - dobDate; else {
    			monthAge--;
    			var dateAge = 31 + currentDate - dobDate;

    			if (monthAge < 0) {
    				monthAge = 11;
    				yearAge--;
    			}
    		}

    		return [yearAge, monthAge, dateAge];
    	}

    	let exp = [];
    	let age = [];

    	onMount(() => {
    		$$invalidate(1, age = calculate_difference(1999, 7, 3));
    		$$invalidate(0, exp = calculate_difference(2021, 0, 21));
    		progress.set(age[0] / 30);
    	});

    	let filteredProjects = [];
    	let searchTerm = "";

    	const searchProjects = () => {
    		return $$invalidate(2, filteredProjects = project_list.filter(project => {
    			let projectName = project.name.toLowerCase();
    			return projectName.includes(searchTerm.toLowerCase());
    		}));
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function searchfilter_searchTerm_binding(value) {
    		searchTerm = value;
    		$$invalidate(3, searchTerm);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		tweened,
    		Navbar,
    		Experience,
    		Education,
    		Skills,
    		Projects,
    		Modal,
    		SearchFilter,
    		Home,
    		NotFound,
    		project_list,
    		now,
    		currentYear,
    		currentMonth,
    		currentDate,
    		progress,
    		calculate_difference,
    		exp,
    		age,
    		filteredProjects,
    		searchTerm,
    		searchProjects
    	});

    	$$self.$inject_state = $$props => {
    		if ('now' in $$props) now = $$props.now;
    		if ('currentYear' in $$props) currentYear = $$props.currentYear;
    		if ('currentMonth' in $$props) currentMonth = $$props.currentMonth;
    		if ('currentDate' in $$props) currentDate = $$props.currentDate;
    		if ('exp' in $$props) $$invalidate(0, exp = $$props.exp);
    		if ('age' in $$props) $$invalidate(1, age = $$props.age);
    		if ('filteredProjects' in $$props) $$invalidate(2, filteredProjects = $$props.filteredProjects);
    		if ('searchTerm' in $$props) $$invalidate(3, searchTerm = $$props.searchTerm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		exp,
    		age,
    		filteredProjects,
    		searchTerm,
    		progress,
    		searchProjects,
    		searchfilter_searchTerm_binding
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
