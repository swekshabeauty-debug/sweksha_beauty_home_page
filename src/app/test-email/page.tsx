'use client';

import { useState } from 'react';

export default function EmailTestPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const testEmail = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/test-email');
            const data = await response.json();
            setResult(data);
        } catch (error: any) {
            setResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    📧 Email Configuration Test
                </h1>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-sm text-gray-700">
                        <strong>Before testing:</strong> Make sure you've created <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> file with your Gmail App Password.
                    </p>
                </div>

                <button
                    onClick={testEmail}
                    disabled={loading}
                    className="w-full bg-brand-primary text-white py-3 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '⏳ Testing...' : '🧪 Test Email Configuration'}
                </button>

                {result && (
                    <div className={`mt-6 p-6 rounded-lg ${result.success ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                        <div className="flex items-start gap-3">
                            <div className="text-3xl">
                                {result.success ? '✅' : '❌'}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold text-lg mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                    {result.success ? 'Success!' : 'Configuration Error'}
                                </h3>

                                <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                                    {result.message || result.error}
                                </p>

                                {result.details && (
                                    <div className="mt-4 bg-white p-4 rounded-lg">
                                        <h4 className="font-bold mb-2">Details:</h4>
                                        <pre className="text-xs overflow-auto">
                                            {JSON.stringify(result.details, null, 2)}
                                        </pre>
                                    </div>
                                )}

                                {result.configuration && (
                                    <div className="mt-4 bg-white p-4 rounded-lg">
                                        <h4 className="font-bold mb-2">Current Configuration:</h4>
                                        <ul className="space-y-1 text-sm">
                                            {Object.entries(result.configuration).map(([key, value]) => (
                                                <li key={key}>
                                                    <span className="font-mono text-gray-600">{key}:</span> {value as string}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {result.help && (
                                    <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                        <h4 className="font-bold text-yellow-800 mb-2">💡 How to Fix:</h4>
                                        <p className="text-sm text-yellow-700 whitespace-pre-line">
                                            {result.help}
                                        </p>
                                    </div>
                                )}

                                {result.success && (
                                    <div className="mt-4 bg-white p-4 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-800">
                                            ✉️ Check your inbox at <strong>{result.details?.to}</strong> for the test email!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-3">📋 Setup Checklist:</h3>
                    <ol className="space-y-2 text-sm text-gray-700">
                        <li>✓ Create <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> file in project root</li>
                        <li>✓ Add <code className="bg-gray-200 px-2 py-1 rounded">EMAIL_USER=swekshabeauty@gmail.com</code></li>
                        <li>✓ Get Gmail App Password from <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-blue-600 underline">here</a></li>
                        <li>✓ Add <code className="bg-gray-200 px-2 py-1 rounded">EMAIL_PASSWORD=your-app-password</code></li>
                        <li>✓ Restart dev server: <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code></li>
                        <li>✓ Click the test button above</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
