if (!window.IEEE754)
{
    window.IEEE754 = {
        T : '0123456789abcdef',
        toHex : function (n) {
            var a = [], b = '', i, s, p = 0;
            a[0] = (n >> 24) & 0xff;
            a[1] = (n >> 16) & 0xff;
            a[2] = (n >>  8) & 0xff;
            a[3] = n & 0xff;

            for (i = 0; i < 4; i ++) {
                if (i != 0) {
                    b += ' ';
                }
                s = (a[i] >> 4) & 0x0f;
                b += this.T[s];
                s = a[i] & 0x0f;
                b += this.T[s];
            }

            return b;
        },
        to: function (f) {
            var S, E, M = 0, q, i, t = '', length = 0, p0, p1, r, P = 0;
            S = f >= 0 ? 0 : 1;
            q = '' + Math.abs (f);
            i = q.indexOf ('.');

            if (i > 0)
            {
                p0 = parseInt (q.substring (0, i));
                p1 = Math.abs(f) - p0;
            } 
            else if (i == 0)
            {
                p0 = 0;
                p1 = Math.abs (f);
            }
            else 
            {
                p0 = parseInt (Math.abs(f));
                p1 = 0;
            }

            while (q > 0)
            {
                length += 8;
                q >>= 8;
            }

            for (i = length - 1; i >= 0; i --)
            {
                if ((p0 & (1 << i)) != 0)
                {
                    t += '1';
                }
                else if (t.length)
                {
                    t += '0';
                }
            }
            
            E = (t.length - 1 + 127) & 0xff;

            // if (p1 != 0)
            // {
                r = 24 - t.length;
                while (r >= 0)
                {
                    p1 = p1 * 2;
                    if (p1 > 1)
                    {
                        t += '1';
                        p1 -= 1;
                    }
                    else
                    {
                        t += '0';
                    }
                    r --;
                }

                for (i = 1; i < t.length - 1; i ++)
                {
                    M <<= 1;
                    if (t[i] == '1')
                    {
                        M |= 1;
                    } 
                }

                if (t[t.length - 1] == '1')
                {
                    M ++;
                }
            // }

            P = (E << 23) | M;
            if (S == 1)
            {
                P = -P;
            }
            return P;
        },
        from: function (i) {
            var S = i >> 31, E = (i >> 23) & 0xff, M = i & 0x7FFFFF, f = 0.0, k, mask, p, y;
            for (k = 0; k < 23; k ++)
            {
                mask = 1 << (22 - k);
                if ((M & mask) !== 0)
                {
                    f += Math.pow (2, -(k + 1));
                }
            }

            p = E == 0 ? -126 : E - 127;
            y = E == 0 ? f : f + 1;
            return Math.pow (-1, S) * Math.pow (2, p) * y;
        }
    };
}
console.log(IEEE754.to(3.14))