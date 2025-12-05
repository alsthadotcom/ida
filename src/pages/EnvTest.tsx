import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';

const EnvTest = () => {
    const [envData, setEnvData] = useState<any>({});

    useEffect(() => {
        // Get all environment variables
        const allEnv = import.meta.env;

        // Sanitize sensitive data for display
        const sanitized: any = {};
        for (const key in allEnv) {
            if (key.includes('TOKEN') || key.includes('KEY') || key.includes('ANON')) {
                sanitized[key] = allEnv[key] ? allEnv[key].substring(0, 8) + '...' : 'undefined';
            } else {
                sanitized[key] = allEnv[key];
            }
        }

        setEnvData({
            sanitized,
            hasGithubToken: !!allEnv.VITE_GITHUB_TOKEN,
            githubTokenLength: allEnv.VITE_GITHUB_TOKEN?.length || 0,
            rawToken: allEnv.VITE_GITHUB_TOKEN
        });

        // Log to console too
        console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
        console.log('GitHub Token exists?', !!allEnv.VITE_GITHUB_TOKEN);
        console.log('GitHub Token value:', allEnv.VITE_GITHUB_TOKEN);
        console.log('All env vars:', allEnv);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="glass-card rounded-xl p-6">
                            <h1 className="text-3xl font-bold mb-2">🔧 Environment Variables Debug</h1>
                            <p className="text-muted-foreground">
                                This page shows what environment variables Vite is loading.
                            </p>
                        </div>

                        {/* GitHub Token Status */}
                        <div className="glass-card rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">GitHub Token Status:</h2>
                            {envData.hasGithubToken ? (
                                <div className="space-y-2">
                                    <p className="text-green-500 text-lg font-semibold">✅ GitHub Token Found!</p>
                                    <p className="text-sm">
                                        Value: <code className="bg-secondary px-2 py-1 rounded">
                                            {envData.rawToken?.substring(0, 8)}...
                                        </code>
                                    </p>
                                    <p className="text-sm">Length: {envData.githubTokenLength} characters</p>
                                    <p className="text-green-600 mt-4">
                                        ✅ You can now submit ideas with MVP files to GitHub!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-red-500 text-lg font-semibold">❌ GitHub Token NOT Found</p>
                                    <p className="text-sm text-muted-foreground">
                                        The VITE_GITHUB_TOKEN environment variable is not loaded.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* All Environment Variables */}
                        <div className="glass-card rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">All Environment Variables:</h2>
                            <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-sm">
                                {JSON.stringify(envData.sanitized, null, 2)}
                            </pre>
                        </div>

                        {/* Next Steps */}
                        <div className="glass-card rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">
                                {envData.hasGithubToken ? '✅ Next Steps:' : '⚠️ Fix Steps:'}
                            </h2>
                            {envData.hasGithubToken ? (
                                <ol className="list-decimal list-inside space-y-2 text-green-600">
                                    <li>Token is loaded successfully!</li>
                                    <li>Files will be uploaded to: <code>https://github.com/idaaz/{'<user-id>'}</code></li>
                                    <li>Go to <a href="/submit-idea" className="underline">/submit-idea</a> and try submitting!</li>
                                </ol>
                            ) : (
                                <ol className="list-decimal list-inside space-y-2">
                                    <li>Stop your dev server (Ctrl+C in terminal)</li>
                                    <li>Verify <code className="bg-secondary px-2 py-1 rounded">.env.local</code> has:
                                        <code className="bg-secondary px-2 py-1 rounded block mt-1">
                                            VITE_GITHUB_TOKEN=ghp_your_token_here
                                        </code>
                                    </li>
                                    <li>NO quotes around the value</li>
                                    <li>NO spaces before or after the =</li>
                                    <li>Restart dev server: <code className="bg-secondary px-2 py-1 rounded">npm run dev</code></li>
                                    <li>Refresh this page and check again</li>
                                </ol>
                            )}
                        </div>

                        {/* Console Tip */}
                        <div className="glass-card rounded-xl p-6 bg-blue-500/10 border-blue-500/20">
                            <h3 className="font-bold mb-2">💡 Quick Console Test:</h3>
                            <p className="text-sm mb-2">Open browser console (F12) and type:</p>
                            <code className="bg-secondary px-3 py-2 rounded block">
                                console.log(import.meta.env.VITE_GITHUB_TOKEN)
                            </code>
                            <p className="text-sm mt-2 text-muted-foreground">
                                Should show your token (starting with ghp_) if loaded correctly.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EnvTest;
