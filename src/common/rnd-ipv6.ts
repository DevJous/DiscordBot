export function getRandomIPv6(prefix: string): string {
    // Separar el prefijo y la longitud del CIDR
    const [ipv6Prefix, cidr] = prefix.split('/');
    const prefixLength = parseInt(cidr);

    // Calcular cuántos bits de la dirección están disponibles para randomizar
    const availableBits = 128 - prefixLength;
    const maxSuffix = BigInt(2 ** availableBits);

    // Generar un sufijo aleatorio
    const randomSuffix = BigInt(Math.floor(Math.random() * Number(maxSuffix)));

    // Convertir el prefijo y el sufijo a un string hexadecimal
    const suffixHex = randomSuffix.toString(16).padStart(availableBits / 4, '0');
    const randomIPv6 = ipv6Prefix + suffixHex.match(/.{1,4}/g)?.join(':');

    return randomIPv6;
}