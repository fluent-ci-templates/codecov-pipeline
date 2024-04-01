use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn upload(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("upload")?
        .pkgx()?
        .with_exec(vec!["pkgx", "install", "curl", "git"])?
        .with_exec(vec![
            "curl",
            "-Os",
            "https://uploader.codecov.io/latest/linux/codecov",
        ])?
        .with_exec(vec!["chmod", "+x", "codecov"])?
        .with_exec(vec!["mkdir", "-p", ".local/bin"])?
        .with_exec(vec!["mv", "codecov", ".local/bin/codecov"])?
        .with_exec(vec![".local/bin/codecov", "-t", "$CODECOV_TOKEN", &args])?
        .stdout()?;
    Ok(stdout)
}
