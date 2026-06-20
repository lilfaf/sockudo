using System;
using NUnit.Framework;
using PusherServer.Tests.Helpers;

namespace PusherServer.Tests
{
    internal static class Config
    {
        static Config()
        {
            IApplicationConfig config = EnvironmentVariableConfigLoader.Default.Load();
            SkipReason = "Skipping live .NET server SDK tests: AppConfig.test.json is not configured for a real live endpoint.";
            IsConfigured = IsRealConfig(config);

            if (!IsConfigured)
            {
                try
                {
                    IApplicationConfig fileConfig = JsonFileConfigLoader.Default.Load();
                    if (IsRealConfig(fileConfig))
                    {
                        config = fileConfig;
                        IsConfigured = true;
                    }
                }
                catch (IgnoreException ex)
                {
                    SkipReason = ex.Message;
                }
            }

            if (!HasRequiredCredentials(config))
            {
                config = new ApplicationConfig
                {
                    AppId = "test-app-id",
                    AppKey = "test-app-key",
                    AppSecret = "test-app-secret",
                    Cluster = "mt1",
                };
            }

            AppId = config.AppId;
            AppKey = config.AppKey;
            AppSecret = config.AppSecret;
            Cluster = config.Cluster;
            HttpHost = config.HttpHost;
            WebSocketHost = config.WebSocketHost;
        }

        public static bool IsConfigured { get; private set; }

        public static string SkipReason { get; private set; }

        public static string AppId { get; private set; }

        public static string AppKey { get; private set; }

        public static string AppSecret { get; private set; }

        public static string Cluster { get; private set; }

        public static string HttpHost { get; private set; }

        public static string WebSocketHost { get; private set; }

        private static bool IsRealConfig(IApplicationConfig config)
        {
            return config != null &&
                   !string.IsNullOrWhiteSpace(config.AppId) &&
                   !string.IsNullOrWhiteSpace(config.AppKey) &&
                   !string.IsNullOrWhiteSpace(config.AppSecret) &&
                   !config.AppId.StartsWith("test-", StringComparison.OrdinalIgnoreCase);
        }

        private static bool HasRequiredCredentials(IApplicationConfig config)
        {
            return config != null &&
                   !string.IsNullOrWhiteSpace(config.AppId) &&
                   !string.IsNullOrWhiteSpace(config.AppKey) &&
                   !string.IsNullOrWhiteSpace(config.AppSecret);
        }
    }
}
