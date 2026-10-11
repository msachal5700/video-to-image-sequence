<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap — videotoimagesequence.online</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; margin: 0; background: #0b0f14; color: #d7dee8; }
          .wrap { max-width: 1100px; margin: 0 auto; padding: 32px 20px 64px; }
          h1 { font-size: 24px; margin: 0 0 8px; color: #fff; }
          p.sub { color: #8b98a9; margin: 0 0 24px; font-size: 14px; }
          p.sub a { color: #22d3ee; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { text-align: left; padding: 10px 12px; background: #131a23; color: #8b98a9; font-weight: 600; border-bottom: 1px solid #232d3a; position: sticky; top: 0; }
          td { padding: 9px 12px; border-bottom: 1px solid #1a222e; vertical-align: top; }
          tr:hover td { background: #111823; }
          td.url { word-break: break-all; }
          td.url a { color: #22d3ee; text-decoration: none; }
          td.url a:hover { text-decoration: underline; }
          .count { display: inline-block; background: #164e63; color: #a5f3fc; border-radius: 999px; padding: 2px 12px; font-size: 12px; font-weight: 600; margin-left: 8px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>XML Sitemap<span class="count"><xsl:value-of select="count(s:urlset/s:url)"/> URLs</span></h1>
          <p class="sub">
            This is the sitemap for <a href="https://www.videotoimagesequence.online/">videotoimagesequence.online</a>.
            It is intended for search engines — this styled view is only for humans.
          </p>
          <table>
            <thead>
              <tr><th>URL</th><th>Last modified</th><th>Change freq.</th><th>Priority</th></tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="url"><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                  <td><xsl:value-of select="s:lastmod"/></td>
                  <td><xsl:value-of select="s:changefreq"/></td>
                  <td><xsl:value-of select="s:priority"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
