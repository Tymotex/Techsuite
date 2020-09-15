#!/bin/sh

echo "Checking for latest package versions"
apt-get update > /dev/null 2> /dev/null

echo "Package installation:"
while IFS= read -r package; do
    if apt-get install -y npm > /dev/null 2>&1; then
        echo "Successfully installed: $package"
    else
        echo "Failed to install: $package"
    fi
done < deb_packages.txt

