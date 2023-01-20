# Deploy to AWS Lambda

## Short list:
1. Install AWS CLI and resolve credentials.   \
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
2. Open a directory with this lambda function. e.g   \
`cd ~/WebstormProjects/internship_group_3/lambda`
3. run `npm install`
4. FOR macOS only - you need to change SHARP package to Linux Arch.   \
Run two additional command:   \
`rm -rf node_modules/sharp`   \
`SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linux --libc=glibc sharp`
5. ZIP your project:
`zip -r function.zip .`\
   into the archive you can see approximately this structure:\
   ~/lambda                    \
   ├── index.js                \
   └── node_modules            \
   ├── package.json            \
   ├── package-lock.json       \
   ├── README.md               \
It's ok, we have to upload function with installed node_modules.
6. Upload your function to AWS by CLI  \
`aws lambda update-function-code --function-name resizeImage --zip-file fileb://function.zip`   \
If your function name not 'resizeImage' you can to set your own name.