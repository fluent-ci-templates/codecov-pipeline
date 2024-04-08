use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn upload(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("upload")?
        .pkgx()?
        .with_packages(vec!["curl", "git"])?
        .with_exec(vec![
            "curl",
            "-Os",
            "https://uploader.codecov.io/latest/linux/codecov",
        ])?
        .with_exec(vec!["chmod", "+x", "codecov"])?
        .with_exec(vec!["./codecov", "-t", "$CODECOV_TOKEN", &args])?
        .stdout()?;
    Ok(stdout)
}
