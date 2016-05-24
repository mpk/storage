var Storage = require('../source/index');

var s = Storage();
var sNs = Storage('test');

if (s.enabled) {

	beforeEach(function() {
		localStorage.clear();
	});

	describe('.set()', function() {

		it('stores a value', function() {
			var result1 = s.set('foo', 23);
			expectData('foo', '23');
			expect(result1.error).toBe(false);

			var result2 = s.set('bar', 54);
			expectData('foo', '23');
			expectData('bar', '54');
			expect(result2.error).toBe(false);

			var result3 = s.set('bar', 70);
			expectData('bar', '70');
			expect(result3.error).toBe(false);
		});

		it('stores basic types', function() {
			var result1 = s.set('foo', false);
			expectData('foo', 'false');
			expect(result1.error).toBe(false);

			var result2 = s.set('foo', null);
			expectData('foo', 'null');
			expect(result2.error).toBe(false);

			var result3 = s.set('foo', 0);
			expectData('foo', '0');
			expect(result3.error).toBe(false);

			var result4 = s.set('foo', '');
			expectData('foo', '""');
			expect(result4.error).toBe(false);
		});

		it('stores NaN and Infinity as null', function() {
			var result1 = s.set('foo', NaN);
			expectData('foo', 'null');
			expect(result1.error).toBe(false);

			var result2 = s.set('foo', Infinity);
			expectData('foo', 'null');
			expect(result2.error).toBe(false);
		});

		it('stores arrays', function() {
			var result1 = s.set('foo', []);
			expectData('foo', '[]');
			expect(result1.error).toBe(false);

			var result2 = s.set('foo', ['a', 1]);
			expectData('foo', '["a",1]');
			expect(result2.error).toBe(false);
		});

		it('stores objects', function() {
			var result1 = s.set('foo', {});
			expectData('foo', '{}');
			expect(result1.error).toBe(false);

			var result2 = s.set('foo', { a: 1 });
			expectData('foo', '{"a":1}');
			expect(result2.error).toBe(false);
		});

		it('stores a value for a namespaced key', function() {
			var result = sNs.set('foo', 23);
			expectData('test.foo', '23');
			expect(result.error).toBe(false);
		});

	});

	describe('.get()', function() {

		it('returns undefined for non-existent key', function() {
			var result = s.get('foo');

			expect(result.value).toBe(undefined);
			expect(result.error).toBe(false);
		});

		it('returns default value for non-existent key', function() {
			var result = s.get('foo', 'bar');

			expect(result.value).toBe('bar');
			expect(result.error).toBe(false);
		});

		it('returns a value', function() {
			s.set('foo', 'bar');

			var result = s.get('foo', 23);
			expect(result.value).toBe('bar');
			expect(result.error).toBe(false);
		});

		it('returns a value for a namespaced key', function() {
			s.set('foo', 23);
			sNs.set('foo', 54);

			var result = s.get('foo');
			expect(result.value).toBe(23);
			expect(result.error).toBe(false);

			var resultNs = sNs.get('foo');
			expect(resultNs.value).toBe(54);
			expect(resultNs.error).toBe(false);
		});

	});

	describe('.remove()', function() {

		it('removes a key', function() {
			s.set('foo', 'bar');
			expect(localStorage.hasOwnProperty('Storage_foo')).toBe(true);

			s.remove('foo');
			expect(localStorage.hasOwnProperty('Storage_foo')).toBe(false);
		});

		it('removes a namespaced key', function() {
			sNs.set('foo', 'bar');
			expect(localStorage.hasOwnProperty('Storage_test.foo')).toBe(true);

			sNs.remove('foo');
			expect(localStorage.hasOwnProperty('Storage_test.foo')).toBe(false);
		});

	});

	describe('.enabled', function() {

		it('detects localStorage availability', function() {
			expect(s.enabled).toBe(true);
		});

	});

} else {

	describe('.set()', function() {

		it('returns an error', function() {
			var result = s.set('foo', 'bar');
			expect(result.error).toBe(true);
		});

	});

	describe('.get()', function() {

		it('returns an error', function() {
			var result = s.get('foo');
			expect(result.error).toBe(true);
		});

	});

	describe('.remove()', function() {

		it('returns an error', function() {
			var result = s.remove('foo');
			expect(result.error).toBe(true);
		});

	});

	describe('.enabled', function() {

		it('detects localStorage availability', function() {
			expect(s.enabled).toBe(false);
		});

	});

}

function expectData( key, content ) {
	expect(localStorage.getItem('Storage_' + key)).toBe('{"data":' + content + '}');
}