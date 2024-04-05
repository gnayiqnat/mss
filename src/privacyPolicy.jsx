import { Box, Typography } from '@mui/material';
import { useMediaQuery } from 'react-responsive';

export default function PrivacyPolicy() {
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 12 }}>
            <Box sx={{ width: isMobile ? '80vw' : '60vw', maxWidth: '700px' }}>
                <Typography>
                    <h1>Privacy Policy</h1>
                    <h4 style={{ fontWeight: '400' }}>
                        This Privacy Policy describes how we collect, use, and
                        disclose information when you use our website TRAT.space
                        (https://trat.space) and the services provided through
                        it. By accessing or using our site, you agree to the
                        terms of this Privacy Policy.
                    </h4>
                    <h2>Supabase</h2>
                    <h4>
                        We use Supabase for database management and related
                        services. When you interact with our site, Supabase may
                        collect certain information, including but not limited
                        to:
                    </h4>
                    User account information such as usernames, email addresses,
                    and profile details. Usage data and analytics related to
                    your interactions with our site. Any other information you
                    choose to provide when using our services. Supabase securely
                    stores this information and uses it to provide and improve
                    our services, including user authentication, database
                    management, and analytics. Supabase may also share this
                    information with third-party service providers as necessary
                    to perform these functions, but will not sell or rent your
                    personal information to third parties for marketing
                    purposes.
                    <h2>Cloudflare</h2>
                    <h4>
                        We use Cloudflare's services to enhance the security and
                        performance of our site. When you access our site,
                        Cloudflare may collect certain information, including
                        but not limited to:
                    </h4>
                    Your IP address and device information. Website usage data
                    such as page views, interactions, and performance metrics.
                    Cookies and similar technologies used for analytics,
                    security, and performance optimization. Cloudflare uses this
                    information to provide content delivery, DDoS protection,
                    and web optimization services. Cloudflare may also share
                    this information with third parties as necessary to provide
                    these services, but will not use your personal information
                    for its own purposes.
                    <h2>Cloudflare Pages</h2>
                    <h4>
                        Our website is hosted on Cloudflare Pages, a platform
                        for deploying and hosting websites. When you visit our
                        site, Cloudflare Pages may collect certain information
                        related to website hosting and usage, including:
                    </h4>
                    Website traffic data such as page views, visitor
                    interactions, and navigation patterns. Server logs and other
                    technical information related to website hosting and
                    performance. Cloudflare Pages uses this information to
                    deliver and optimize our website, monitor its performance,
                    and troubleshoot issues. Cloudflare Pages may also collect
                    and store this information for a limited period for security
                    and diagnostic purposes.
                    <h2 style={{ marginTop: '50px' }}>Contact Us</h2>
                    If you have any questions or concerns about our Privacy
                    Policy or the use of your information, please contact us at{' '}
                    <b>gnayiqnat@gmail.com</b>.<h3>Changes to this Policy</h3>
                    We reserve the right to update or change this Privacy Policy
                    at any time. Any changes will be effective immediately upon
                    posting the revised Privacy Policy on our site. Your
                    continued use of our site after any such changes constitutes
                    your acceptance of the revised Privacy Policy.
                </Typography>
            </Box>
        </Box>
    );
}
